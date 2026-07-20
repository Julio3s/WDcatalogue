import { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { getProductBySlug } from '../api/catalog';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import ProductImageCarousel from '../components/ProductImageCarousel';
import { QuantitySelector } from '../components/QuantitySelector';
import { useSelectionStore } from '../store/selectionStore';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSeo } from '../hooks/useSeo';

function buildImagesArray(product) {
  if (!product) return [];

  const result = [];
  const mainImageUrl = product.image_url || product.image || '';

  if (mainImageUrl) {
    result.push({ image_url: mainImageUrl, media_type: 'image', order: 0 });
  }

  if (Array.isArray(product.images)) {
    product.images.forEach((img, idx) => {
      if (img.media_type === 'video' && img.video_url) {
        result.push({
          video_url: img.video_url,
          media_type: 'video',
          thumbnail_url: img.image_url || img.image || null,
          order: idx + 1,
        });
        return;
      }

      const imgUrl = img.image_url || img.image || '';
      if (imgUrl && imgUrl !== mainImageUrl) {
        result.push({ image_url: imgUrl, media_type: 'image', order: idx + 1 });
      }
    });
  }

  return result.sort((a, b) => a.order - b.order);
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [addedToSelection, setAddedToSelection] = useState(false);

  const addItem = useSelectionStore((state) => state.addItem);

  usePageTitle(product ? `${product.name} - WORLD DESIGN` : 'WORLD DESIGN');
  useSeo(product ? { title: product.name, description: product.description } : {});

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductBySlug(slug);
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Impossible de charger le produit.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleAddToSelection = () => {
    addItem(product, quantity, customText, selectedModel);
    setAddedToSelection(true);
    setTimeout(() => setAddedToSelection(false), 2000);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState description={error} />;
  if (!product) return <ErrorState title="Produit introuvable" />;

  const images = buildImagesArray(product);
  const reference = product.reference || `WD${String(product.id).padStart(4, '0')}`;

  return (
    <div className="min-h-screen bg-[#F6F1EA] py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#8D8175]">
          <Link to="/" className="transition hover:text-[#171311]">
            Accueil
          </Link>
          <span>/</span>
          <Link to="/products" className="transition hover:text-[#171311]">
            Catalogue
          </Link>
          <span>/</span>
          <span className="truncate font-medium text-[#171311]">{product.name}</span>
        </nav>

        <div className="overflow-hidden rounded-[32px] border border-[#E5DDD4] bg-white shadow-[0_20px_60px_rgba(19,16,13,0.06)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-[#FBF8F3] p-4 sm:p-6">
              <div className="rounded-[28px] bg-white p-3 shadow-[0_12px_40px_rgba(19,16,13,0.05)] sm:p-4">
                <ProductImageCarousel images={images} productName={product.name} />
              </div>
            </div>

            <div className="flex flex-col px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#A58A63]">
                Fiche produit
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-[#171311] sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                {product.category ? (
                  <Link
                    to={`/products?category=${product.category.slug}`}
                    className="rounded-full bg-[#F4EFE8] px-4 py-2 text-sm font-semibold text-[#171311] transition hover:bg-[#EAE2D8]"
                  >
                    {product.category.name}
                  </Link>
                ) : null}
                <span className="rounded-full bg-[#171311] px-4 py-2 text-sm font-semibold text-white">
                  Réf. {reference}
                </span>
              </div>

              <p className="mt-6 text-base leading-8 text-[#6F6257]">{product.description}</p>

              {product.has_models && Array.isArray(product.models) && product.models.length > 0 ? (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8D8175]">
                    Modèle
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.model_value)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          selectedModel === model.model_value
                            ? 'border-[#171311] bg-[#171311] text-white'
                            : 'border-[#DCCFC3] bg-white text-[#4C4138] hover:border-[#171311]'
                        }`}
                      >
                        {model.model_value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {product.is_customizable ? (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8D8175]">
                    Informations complémentaires
                  </h3>
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder={product.customization_hint || 'Indiquez ici votre texte, votre logo ou toute précision utile...'}
                    className="mt-3 w-full resize-none rounded-[20px] border border-[#E5DDD4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#171311]"
                    rows={4}
                  />
                </div>
              ) : null}

              <div className="mt-8">
                <QuantitySelector quantity={quantity} onChange={setQuantity} />
              </div>

              <button
                onClick={handleAddToSelection}
                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold transition ${
                  addedToSelection ? 'bg-green-600 text-white' : 'bg-[#171311] text-white hover:bg-[#2A241F]'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                {addedToSelection ? 'Ajouté à la sélection' : 'Ajouter à la sélection'}
              </button>

              <Link
                to="/ma-selection"
                className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#6F6257] transition hover:text-[#171311]"
              >
                Voir ma sélection
              </Link>

              <div className="mt-10 rounded-[24px] bg-[#FBF8F3] p-5">
                <p className="text-sm font-semibold text-[#171311]">Besoin d’un autre angle de vue ?</p>
                <p className="mt-2 text-sm leading-7 text-[#6F6257]">
                  Parcourez les visuels disponibles, ajustez les options, puis conservez vos choix
                  dans votre sélection.
                </p>
              </div>

              <Link
                to="/products"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#6F6257] transition hover:text-[#171311]"
              >
                <ArrowLeft className="h-4 w-4" />
                Revenir au catalogue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
