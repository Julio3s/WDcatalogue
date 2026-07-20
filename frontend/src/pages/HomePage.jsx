import { useEffect, useState, useCallback } from 'react';
import {
  ArrowRight,
  CheckCircle2,
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

const VALUE_CARDS = [
  {
    icon: Sparkles,
    title: 'Présentation soignée',
    text: 'Des visuels nets, des blocs aérés et des titres lisibles pour voir vite ce qui compte.',
  },
  {
    icon: ShieldCheck,
    title: 'Cadre fiable',
    text: 'Le visiteur n’a rien à créer, la sélection reste dans le navigateur et l’administration garde la main.',
  },
  {
    icon: ShoppingBag,
    title: 'Demande fluide',
    text: 'Vous rassemblez vos choix, puis vous les envoyez en un seul message sur WhatsApp.',
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
      <section className="relative -mt-px overflow-hidden bg-[#171311]">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/72 via-black/44 to-[#F6F1EA]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex min-h-[48svh] w-full max-w-7xl items-start px-4 pb-6 pt-2 sm:px-6 sm:pt-3 lg:px-8 lg:pt-4">
          <div className="max-w-3xl pt-1 sm:pt-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur-md">
              Catalogue public
            </p>
            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.02] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Des objets qui donnent du relief
              <span className="mt-2 block bg-gradient-to-r from-[#F5A623] to-[#E94560] bg-clip-text text-transparent">
                à votre marque
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              Parcourez une sélection de goodies personnalisés, préparez votre demande en quelques gestes
              et envoyez-la à notre équipe pour obtenir un devis clair, rapide et adapté à votre projet.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #E94560, #D63A54)' }}
              >
                Ouvrir le catalogue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/ma-selection"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-bold text-white transition hover:border-[#F5A623] hover:text-[#F5A623]"
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
          title="Les références à surveiller"
          description="Une sélection courte pour voir le rendu des matières, des finitions et des usages les plus parlants."
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
          title="Des univers pensés par usage"
          description="Chaque catégorie rassemble des références proches pour vous aider à aller droit à l’essentiel."
        />

          <div className="mt-10">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-[24px] bg-[#F8F5F0]" />
                ))}
              </div>
            ) : categoryPreview.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryPreview.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Aucune catégorie disponible"
                description="Créez des catégories depuis l’administration pour structurer la vitrine du catalogue."
              />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Parcours"
          title="Du premier regard à l’envoi WhatsApp"
          description="Ouvrir, comparer, ajouter, envoyer: le parcours reste court et lisible sur mobile comme sur desktop."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {JOURNEY.map(({ num, icon: Icon, title, desc }, index) => (
            <div
              key={num}
              className="rounded-[24px] border border-[#E0DBD5] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
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
      </section>

      <section className="bg-[#1A1A2E] py-16 text-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pourquoi ça marche"
          title="Une vitrine qui va droit au but"
          description="Des cartes lisibles, des visuels généreux et des actions claires pour avancer sans perdre de temps."
          align="center"
        />

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {VALUE_CARDS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-[24px] border border-white/10 bg-white/5 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#F5A623]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-white/70">{text}</p>
            </div>
            ))}
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

      <style>{`
        @keyframes heroFloat {
          from { transform: translateY(0px); }
          to { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

