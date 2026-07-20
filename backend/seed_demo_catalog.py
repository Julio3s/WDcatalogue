import os

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.products.models import Category, Product


def main():
    category, _ = Category.objects.get_or_create(
        name='Goodies en bois',
        defaults={'slug': 'goodies-en-bois'},
    )

    product, created = Product.objects.get_or_create(
        name='Porte-clés gravé',
        defaults={
            'description': 'Porte-clés en bois personnalisable, parfait pour un aperçu du catalogue public.',
            'category': category,
            'is_active': True,
            'is_featured': True,
            'is_customizable': True,
            'customization_hint': 'Ajoutez votre logo ou un prénom.',
            'has_models': False,
            'model_type': 'none',
        },
    )

    changed = False
    if product.category_id != category.id:
        product.category = category
        changed = True
    if not product.description:
        product.description = 'Porte-clés en bois personnalisable, parfait pour un aperçu du catalogue public.'
        changed = True
    if not product.is_active:
        product.is_active = True
        changed = True
    if not product.is_featured:
        product.is_featured = True
        changed = True
    if not product.is_customizable:
        product.is_customizable = True
        changed = True
    if not product.customization_hint:
        product.customization_hint = 'Ajoutez votre logo ou un prénom.'
        changed = True
    if product.model_type != 'none':
        product.model_type = 'none'
        changed = True

    if changed or created:
        product.save()

    print(f'Category ready: {category.name} ({category.slug})')
    print(f'Product ready: {product.name} ({product.slug}) active={product.is_active} featured={product.is_featured}')


if __name__ == '__main__':
    main()
