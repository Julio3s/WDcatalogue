import { usePageTitle } from '../hooks/usePageTitle';
import { buildWhatsAppUrl } from '../utils/whatsapp';

const PILLARS = [
  {
    title: 'Une image plus nette',
    text: 'Nous mettons en avant des objets utiles, élégants et faciles à présenter dans un contexte professionnel.',
  },
  {
    title: 'Un parcours simple',
    text: 'Le site vous permet de parcourir, comparer et regrouper vos envies sans créer de compte.',
  },
  {
    title: 'Un suivi humain',
    text: 'Dès que votre sélection est prête, nous reprenons la main pour répondre avec précision et réactivité.',
  },
];

const NUMBERS = [
  { value: '100%', label: 'Accès libre au catalogue' },
  { value: '24h', label: 'Temps de réponse cible' },
  { value: '0', label: 'Paiement côté site' },
];

export default function InfoPage() {
  usePageTitle('À propos — WORLD DESIGN');

  return (
    <div className="min-h-screen bg-cream">
      <section className="bg-primary py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            À propos
          </p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Des goodies pensés pour valoriser votre marque
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">
            WORLD DESIGN rassemble des objets personnalisés, une présentation soignée et un parcours simple
            pour transformer une découverte produit en une demande claire et exploitable.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="rounded-[28px] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Notre histoire</p>
            <h2 className="mt-3 text-3xl font-bold text-primary">Une vitrine plus claire pour des objets utiles</h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-text-muted">
              <p>
                Le projet WORLD DESIGN a été construit autour d’une idée simple: aider les entreprises à
                trouver rapidement des supports de communication cohérents, visibles et faciles à partager.
              </p>
              <p>
                Le catalogue a été conçu pour rester lisible sur mobile, rapide à parcourir et suffisamment
                élégant pour mettre les produits au premier plan.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {NUMBERS.map((item) => (
              <div key={item.label} className="rounded-[28px] border border-[#E0DBD5] bg-white p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                <p className="text-4xl font-black text-primary">{item.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {PILLARS.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-[#E0DBD5] bg-[#F8F5F0] p-6">
                <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-[#E0DBD5] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <h2 className="text-2xl font-bold text-primary">Notre mission</h2>
            <p className="mt-4 text-base leading-8 text-text-muted">
              Offrir une expérience simple, inspirante et fiable pour repérer des produits personnalisables,
              construire une sélection pertinente et passer rapidement au contact avec l’équipe.
            </p>
          </div>

          <div className="rounded-[28px] border border-[#E0DBD5] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <h2 className="text-2xl font-bold text-primary">Notre vision</h2>
            <p className="mt-4 text-base leading-8 text-text-muted">
              Faire du catalogue un outil de décision clair pour vos goodies, vos actions de communication
              et vos projets de personnalisation, avec une présentation qui inspire confiance dès la première visite.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#1A1A2E] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Une direction visuelle plus respirante</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            L’interface privilégie les grandes cartes, les titres lisibles et les espaces ouverts pour laisser
            les images parler avant tout.
          </p>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-semibold text-primary transition hover:bg-white/90"
          >
            Nous écrire sur WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
