import json
import logging

from decouple import config
from django.db import IntegrityError
from django.db.models import Count, Q, Value, CharField
from django.db.models.functions import Concat, Lower
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.html import escape
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.users.permissions import IsAdminUser as IsWorldDesignAdminUser

from .models import Category, Product
from .serializers import (
    _cloudinary_url,
    CategorySerializer,
    CategoryAdminSerializer,
    ProductAdminSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)

logger = logging.getLogger('products')


class ProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 1000


def _normalize_admin_payload(data):
    # Don't copy request.data directly as it may contain file uploads (BufferedRandom)
    # Instead, create a new dict with the values we need
    payload = {}
    for key, value in data.items():
        if key == 'category' and value == '':
            payload[key] = None
        else:
            payload[key] = value
    return payload


def _apply_product_search(queryset, search):
    """Recherche puissante sur les produits : nom, description, catégorie, référence (WDxxxx)."""
    if not search or not search.strip():
        return queryset

    query = search.strip().lower()

    # Recherche par référence formatée (ex: WD0001, wd42)
    if query.startswith('wd'):
        ref_num = query[2:].lstrip('0')
        if ref_num.isdigit():
            return queryset.filter(id=int(ref_num))

    # Recherche par ID simple
    if query.isdigit():
        return queryset.filter(Q(id=int(query)) | Q(name__icontains=query))

    # Recherche full-text sur nom, description, slug, catégorie
    return queryset.filter(
        Q(name__icontains=query)
        | Q(slug__icontains=query)
        | Q(description__icontains=query)
        | Q(category__name__icontains=query)
        | Q(category__slug__icontains=query)
    )


@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories(request):
    """List all categories."""
    categories = Category.objects.all().order_by('name')
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsWorldDesignAdminUser])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_categories(request):
    """Admin collection endpoint for listing and creating categories."""
    if request.method == 'GET':
        categories = Category.objects.annotate(product_count=Count('products')).all().order_by('name')
        search = request.query_params.get('search', '').strip()
        if search:
            categories = categories.filter(name__icontains=search)

        serializer = CategoryAdminSerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    serializer = CategoryAdminSerializer(data=request.data)
    if serializer.is_valid():
        try:
            category = serializer.save()
        except IntegrityError:
            return Response(
                {'detail': 'A category with the same name or slug already exists'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(CategoryAdminSerializer(category).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsWorldDesignAdminUser])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_category_detail(request, pk):
    """Admin endpoint for retrieving, updating and deleting a category."""
    category = get_object_or_404(Category.objects.annotate(product_count=Count('products')), pk=pk)

    if request.method == 'GET':
        serializer = CategoryAdminSerializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method in ['PUT', 'PATCH']:
        serializer = CategoryAdminSerializer(category, data=request.data, partial=request.method == 'PATCH')
        if serializer.is_valid():
            try:
                category = serializer.save()
            except IntegrityError:
                return Response(
                    {'detail': 'A category with the same name or slug already exists'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(CategoryAdminSerializer(category).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    category.delete()
    return Response({'detail': 'Category deleted successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_products(request):
    """List active products with filtering and pagination."""
    products = (
        Product.objects.select_related('category')
        .filter(is_active=True)
        .order_by(Lower('name'), 'name')
    )

    category_slug = request.query_params.get('category')
    if category_slug:
        products = products.filter(category__slug=category_slug)

    search = request.query_params.get('search', '').strip()
    if search:
        products = products.filter(
            Q(name__icontains=search)
            | Q(slug__icontains=search)
            | Q(description__icontains=search)
            | Q(category__name__icontains=search)
            | Q(category__slug__icontains=search)
        )

    paginator = ProductPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductListSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail(request, slug):
    """Get product detail by slug."""
    product = get_object_or_404(Product.objects.select_related('category'), slug=slug, is_active=True)
    serializer = ProductDetailSerializer(product)
    return Response(serializer.data, status=status.HTTP_200_OK)


def product_og_view(request, slug):
    """Page HTML statique avec balises Open Graph pour l'aperçu des liens partagés (WhatsApp, etc.).

    Le crawler de WhatsApp ne rend pas le JavaScript : il lit le HTML brut. Cette page
    expose donc toutes les métadonnées (titre, description, image) puis redirige le
    visiteur vers la fiche produit du frontend.
    """
    product = get_object_or_404(Product.objects.select_related('category'), slug=slug, is_active=True)

    site_url = config('SITE_URL', default='http://localhost:5173').rstrip('/')
    frontend_url = f'{site_url}/products/{product.slug}/'
    image_url = _cloudinary_url(product.image) or ''

    description = (product.description or '').strip()
    if len(description) > 200:
        description = f'{description[:197].rstrip()}...'

    title = product.name

    image_tags = ''
    if image_url:
        image_tags = (
            f'<meta property="og:image" content="{escape(image_url)}" />\n'
            f'<meta property="og:image:width" content="1200" />\n'
            f'<meta property="og:image:height" content="630" />\n'
            f'<meta name="twitter:image" content="{escape(image_url)}" />'
        )

    html = f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{escape(title)} | WORLD DESIGN</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{escape(description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="WORLD DESIGN">
<meta property="og:title" content="{escape(title)}">
<meta property="og:description" content="{escape(description)}">
{image_tags}
<meta property="og:url" content="{escape(frontend_url)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{escape(title)}">
<meta name="twitter:description" content="{escape(description)}">
<link rel="canonical" href="{escape(frontend_url)}">
<meta http-equiv="refresh" content="0; url={escape(frontend_url)}">
</head>
<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#F6F1EA;color:#171311;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px;">
  <div>
    <p style="font-size:18px;font-weight:700;">{escape(title)}</p>
    <p style="color:#6F6257;margin-top:8px;">Redirection vers WORLD DESIGN…</p>
    <a href="{escape(frontend_url)}" style="display:inline-block;margin-top:16px;background:#171311;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600;">Voir le produit</a>
  </div>
  <script>window.location.replace({json.dumps(frontend_url)});</script>
</body>
</html>"""
    return HttpResponse(html, content_type='text/html; charset=utf-8')


@api_view(['GET'])
@permission_classes([AllowAny])
def featured_products(request):
    """Get up to six featured products."""
    products = Product.objects.select_related('category').filter(is_active=True, is_featured=True)[:6]
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsWorldDesignAdminUser])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_products(request):
    """Admin collection endpoint for listing and creating products."""
    if request.method == 'GET':
        products = Product.objects.select_related('category').all().order_by('-created_at')

        category_slug = request.query_params.get('category')
        if category_slug:
            products = products.filter(category__slug=category_slug)

        search = request.query_params.get('search', '').strip()
        if search:
            products = _apply_product_search(products, search)

        is_active = request.query_params.get('is_active')
        if is_active is not None:
            normalized = str(is_active).strip().lower()
            if normalized in {'true', '1', 'yes'}:
                products = products.filter(is_active=True)
            elif normalized in {'false', '0', 'no'}:
                products = products.filter(is_active=False)
            else:
                return Response(
                    {'detail': 'Invalid is_active value'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        paginator = ProductPagination()
        paginated_products = paginator.paginate_queryset(products, request)
        serializer = ProductAdminSerializer(paginated_products, many=True)
        return paginator.get_paginated_response(serializer.data)

    payload = _normalize_admin_payload(request.data)
    logger.info(f'Admin product creation request: name={payload.get("name")} category={payload.get("category")}')
    serializer = ProductAdminSerializer(data=payload, context={'request': request})
    if serializer.is_valid():
        try:
            product = serializer.save()
            logger.info(f'Admin product created successfully: id={product.id} slug={product.slug}')
            return Response(ProductAdminSerializer(product, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            logger.error(f'IntegrityError during admin product creation: {e}')
            return Response(
                {'detail': 'A product with the same name or slug already exists'},
                status=status.HTTP_400_BAD_REQUEST,
            )
    logger.warning(f'Admin product creation validation failed: {serializer.errors}')
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsWorldDesignAdminUser])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_product_detail(request, pk):
    """Admin endpoint for retrieving, updating and deactivating a product."""
    product = get_object_or_404(Product.objects.select_related('category'), pk=pk)

    if request.method == 'GET':
        serializer = ProductAdminSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method in ['PUT', 'PATCH']:
        payload = _normalize_admin_payload(request.data)
        serializer = ProductAdminSerializer(product, data=payload, partial=request.method == 'PATCH', context={'request': request})
        if serializer.is_valid():
            try:
                product = serializer.save()
            except IntegrityError as exc:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f'IntegrityError updating product {pk}: {exc}')
                return Response(
                    {'detail': 'A product with the same name or slug already exists'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(ProductAdminSerializer(product, context={'request': request}).data, status=status.HTTP_200_OK)
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f'Validation errors updating product {pk}: {serializer.errors}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    product.is_active = False
    product.save()
    return Response(
        {'detail': 'Product deactivated successfully'},
        status=status.HTTP_200_OK,
    )


@api_view(['DELETE'])
@permission_classes([IsWorldDesignAdminUser])
def admin_product_hard_delete(request, pk):
    """Admin endpoint for permanently deleting a product."""
    product = get_object_or_404(Product, pk=pk)
    product.delete()
    return Response({'detail': 'Product deleted successfully'}, status=status.HTTP_200_OK)