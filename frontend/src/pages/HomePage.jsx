import { useEffect, useState, useCallback } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  Pencil,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { CategoryCard } from '../components/CategoryCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/skeletons/ProductGridSkeleton';
import { SectionHeading } from '../components/SectionHeading';
import { usePageTitle } from '../hooks/usePageTitle';
import { getFeaturedProducts, getCategories } from '../api/catalog';
import { buildWhatsAppUrl } from '../utils/whatsapp';

const HERO_IMAGE = '/images/65dc3458-a3c5-4ecb-8410-70aa471fc9e8.jpg';

const JOURNEY = [
  {
    num: '01',
    icon: Eye,
    title: 'Parcourir',
    desc: 'Ouvrez les fiches, regardez les visuels et gardez seulement les références qui vous parlent.',
  },
  {
    num: '02',
    icon: Pencil,
    title: 'Composer',
    desc: 'Ajoutez vos consignes de personnalisation, un modèle éventuel ou une précision utile.',
  },
  {
    num: '03',
    icon: CheckCircle2,
    title: 'Valider',
    desc: 'Rassemblez les articles retenus, ajustez les quantités et gardez tout au même endroit.',
  },
  {
    num: '04',
    icon: Truck,
    title: 'Recevoir',
    desc: 'Votre demande part sur WhatsApp et l’équipe vous répond avec les prochaines étapes.',
  },
];

const FAQ = [
  {
    q: 'Combien de temps pour recevoir un retour ?',
    a: 'En règle générale, notre équipe revient vers vous sous 24 heures ouvrées après réception de votre sélection.',
  },
  {
    q: 'Dois-je créer un compte pour parcourir le site ?',
    a: 'Non. Le catalogue reste entièrement accessible sans inscription ni connexion côté visiteur.',
  },
  {
    q: 'Comment transmettre ma sélection ?',
    a: 'Une fois votre sélection prête, cliquez sur WhatsApp pour envoyer votre message prérempli à notre équipe.',
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-4 text-left font-semibold text-[#1A1A2E] transition hover:text-[#E94560] sm:px-6"
        aria-expanded={isOpen}
      >
        {item.q}
        <span className={`text-[#1A1A2E]/30 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
          ›
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-5' : 'max-h-0'}`}>
        <p className="px-4 text-sm leading-7 text-[#1A1A2E]/60 sm:px-6">{item.a}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  usePageTitle('WORLD DESIGN — Catalogue premium');

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [cats, featured] = await Promise.all([getCategories(), getFeaturedProducts()]);
      setCategories(cats);
      setFeaturedProducts(featured);
    } catch (err) {
      setError(err?.message || 'Impossible de charger la vitrine.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const featuredPreview = featuredProducts.slice(0, 6);
  const categoryPreview = categories.slice(0, 6);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F6F1EA] text-text-dark">
      <section className="relative -mt-1 overflow-hidden bg-[#171311]">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
            style={{}}
          />
        </div>
        <div
          className="absolute inset-0 bg-black/70"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex min-h-[40svh] w-full max-w-7xl items-start px-4 pb-6 pt-3 sm:min-h-[44svh] sm:px-6 sm:pt-5 lg:px-8 lg:pt-7">
          <div className="max-w-3xl pt-1 sm:pt-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur-md">
              Catalogue premium
            </p>
            <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-[1.02] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Des objets qui donnent du relief
              <span className="mt-2 block bg-gradient-to-r from-[#F5A623] to-[#E94560] bg-clip-text text-transparent">
                à votre marque
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white sm:mt-5 sm:text-lg">
              Parcourez une sélection de goodies personnalisés, préparez votre demande en quelques gestes
              et envoyez-la à notre équipe pour obtenir un devis clair, rapide et adapté à votre projet.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] sm:px-8 sm:py-4"
                style={{ background: 'linear-gradient(135deg, #E94560, #D63A54)' }}
              >
                Ouvrir le catalogue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/ma-selection"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition hover:border-[#F5A623] hover:text-[#F5A623] sm:px-8 sm:py-4"
              >
                Voir ma sélection
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pièces à voir"
          title="SELECTION RAPIDE"
        />

        <div className="mt-10">
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : error ? (
            <ErrorState description={error} onRetry={loadData} />
          ) : featuredPreview.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {featuredPreview.map((product) => (
                <ProductCard key={product.id} product={product} badgeLabel="Sélection" />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucune référence mise en avant"
              description="Dès qu’une référence est passée en vedette dans l’administration, elle s’affichera ici."
            />
          )}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Univers"
          title="CATEGORIES DE PRODUITS"
        />

          <div className="mt-10">
            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-[24px] bg-[#F8F5F0]" />
                ))}
              </div>
            ) : categoryPreview.length > 0 ? (
              <>
                <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                  {categoryPreview.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    to="/categories"
                    className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#E5DDD4] bg-white px-6 py-3 text-sm font-semibold text-[#171311] transition hover:border-[#A58A63] hover:text-[#A58A63]"
                  >
                    Voir toutes les catégories
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </>
            ) : (
              <EmptyState
                title="Aucune catégorie disponible"
                description="Créez des catégories depuis l’administration pour structurer la vitrine du catalogue."
              />
            )}
          </div>
        </div>
      </section>

      {/* ---- Section : Soumettre son projet (entre catégories et parcours) ---- */}
      <section className="relative overflow-hidden bg-[#151028] py-20 sm:py-28">
        {/* Liserés lumineux dégradés (délimitent bien la section sombre) */}
        <div
          className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-transparent via-[#F5A623] to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 z-10 h-1 bg-gradient-to-r from-transparent via-[#E94560] to-transparent"
          aria-hidden="true"
        />

        {/* Halos d'arrière-plan bien plus présents pour donner de l'éclat */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 25%, #F5A623 0%, transparent 45%), radial-gradient(circle at 80% 70%, #E94560 0%, transparent 45%), radial-gradient(circle at 70% 12%, rgba(233, 69, 96, 0.35) 0%, transparent 40%)',
          }}
          aria-hidden="true"
        />

        {/* Étoiles scintillantes décoratives */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <span
            className="absolute left-[10%] top-[18%] text-lg text-[#F5A623] opacity-70 animate-[twinkle_3s_ease-in-out_infinite]"
            style={{ animationDelay: '0s' }}
          >
            ✦
          </span>
          <span
            className="absolute right-[12%] top-[22%] text-sm text-[#E94560] opacity-60 animate-[twinkle_3.4s_ease-in-out_infinite]"
            style={{ animationDelay: '0.7s' }}
          >
            ✦
          </span>
          <span
            className="absolute left-[18%] bottom-[20%] text-sm text-[#F5A623] opacity-60 animate-[twinkle_3.8s_ease-in-out_infinite]"
            style={{ animationDelay: '1.3s' }}
          >
            ✦
          </span>
          <span
            className="absolute right-[20%] bottom-[24%] text-lg text-[#E94560] opacity-70 animate-[twinkle_4.2s_ease-in-out_infinite]"
            style={{ animationDelay: '0.4s' }}
          >
            ✦
          </span>
          <span
            className="absolute right-[45%] top-[12%] text-xs text-white/70 opacity-60 animate-[twinkle_3.1s_ease-in-out_infinite]"
            style={{ animationDelay: '1.8s' }}
          >
            ✦
          </span>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#F5A623]/50 bg-gradient-to-r from-[#F5A623]/20 to-[#E94560]/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.22em] text-[#F5A623] shadow-[0_0_35px_rgba(245,166,35,0.35)] backdrop-blur-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Projet sur mesure
          </p>
          <h2 className="mt-7 text-3xl font-black leading-[1.15] text-white sm:text-4xl lg:text-5xl">
            L’imagination n’a pas de limites…
            <span className="mt-3 block bg-gradient-to-r from-[#F5A623] via-[#FFB84D] to-[#E94560] bg-clip-text text-transparent">
              et nos créations non plus !
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
            Soumettez votre projet, nous vous dirons comment le rendre possible.
          </p>

          {/* Réassurance */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80">
              <ShieldCheck className="h-3.5 w-3.5 text-[#F5A623]" aria-hidden="true" />
              Devis adapté à votre projet
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80">
              <Clock className="h-3.5 w-3.5 text-[#F5A623]" aria-hidden="true" />
              Réponse sous 24 h ouvrées
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#F5A623]" aria-hidden="true" />
              Accompagnement personnalisé
            </span>
          </div>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={buildWhatsAppUrl("Bonjour ! J'aimerais soumettre un projet personnalisé. Pouvez-vous m'aider à le concrétiser ?")}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#F5A623] to-[#E94560] px-9 py-4 text-base font-bold text-white shadow-[0_14px_45px_rgba(233,69,96,0.45)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_18px_60px_rgba(245,166,35,0.5)] active:scale-[0.97]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Soumettre mon projet
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:border-[#F5A623] hover:text-[#F5A623]"
            >
              Parcourir le catalogue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Parcours"
          title="Du premier regard à l’envoi WhatsApp"
          description="Ouvrir, comparer, ajouter, envoyer: le parcours reste court et lisible sur mobile comme sur desktop."
        />

        <div className="relative mt-10">
          <div className="mb-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => document.getElementById('journey-scroll')?.scrollBy({ left: -360, behavior: 'smooth' })}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E0DBD5] bg-white text-[#1A1A1A] shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition hover:border-[#A58A63] hover:text-[#A58A63]"
              aria-label="Défiler les étapes vers la gauche"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('journey-scroll')?.scrollBy({ left: 360, behavior: 'smooth' })}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E0DBD5] bg-white text-[#1A1A1A] shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition hover:border-[#A58A63] hover:text-[#A58A63]"
              aria-label="Défiler les étapes vers la droite"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div id="journey-scroll" className="overflow-x-auto pb-3 scroll-smooth">
            <div className="flex min-w-max gap-4 snap-x snap-mandatory pr-12">
              {JOURNEY.map(({ num, icon: Icon, title, desc }, index) => (
                <div
                  key={num}
                  className="w-[18rem] shrink-0 snap-start rounded-[24px] border border-[#E0DBD5] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:w-[20rem] lg:w-[22rem]"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F5F0] text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    Étape {num}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-text-dark">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions rapides"
            description="Les réponses les plus utiles pour comprendre comment utiliser le catalogue et envoyer votre sélection."
            align="center"
          />

          <div className="mt-10 space-y-3">
            {FAQ.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                isOpen={activeFaq === i}
                onToggle={() => setActiveFaq(activeFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: 'linear-gradient(135deg, #E94560 0%, #D63A54 100%)' }}>
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
            Passage à l’action
          </p>
          <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Prêt à préparer votre prochaine sélection ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Parcourez le catalogue, ajoutez ce qui vous intéresse, puis envoyez le tout sur WhatsApp en un seul message.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/products"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-[#E94560] transition-all hover:bg-white/90 active:scale-[0.98] sm:w-auto"
            >
              Ouvrir le catalogue
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 text-sm font-bold text-white transition hover:border-white hover:bg-white/10 sm:w-auto"
            >
              Écrire sur WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

