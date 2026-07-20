import { useState } from 'react';
import { Search } from 'lucide-react';

import { usePageTitle } from '../hooks/usePageTitle';
import { buildWhatsAppUrl } from '../utils/whatsapp';

const FAQ = [
  {
    q: 'Catalogue et sélection',
    items: [
      {
        q: 'Quels produits puis-je parcourir ?',
        a: 'Le catalogue rassemble des goodies personnalisés, des objets de communication et des supports pensés pour présenter votre marque avec clarté.',
      },
      {
        q: 'Faut-il créer un compte pour utiliser le site ?',
        a: 'Non. Vous pouvez parcourir le catalogue, ouvrir les fiches produits et préparer votre sélection librement.',
      },
      {
        q: 'Comment envoyer ma sélection ?',
        a: 'Ajoutez les produits souhaités, puis envoyez la sélection via WhatsApp avec le message prérempli.',
      },
    ],
  },
  {
    q: 'Personnalisation',
    items: [
      {
        q: 'Puis-je ajouter un texte ou un logo ?',
        a: 'Oui. Les fiches produits et la sélection permettent de transmettre vos informations complémentaires.',
      },
      {
        q: 'Proposez-vous des modèles ?',
        a: 'Certains produits affichent des modèles ou variantes pour aider le visiteur à choisir la bonne configuration.',
      },
      {
        q: 'Peut-on envoyer ses propres fichiers ?',
        a: 'Oui, selon le projet. L’équipe peut vérifier vos éléments avant de confirmer la suite à donner.',
      },
    ],
  },
  {
    q: 'Contact et retour',
    items: [
      {
        q: 'Sous quel délai recevez-vous ma demande ?',
        a: 'Notre objectif est de revenir vers vous rapidement, généralement sous 24 heures ouvrées.',
      },
      {
        q: 'Comment suivre une demande déjà envoyée ?',
        a: 'Le plus simple reste de répondre au message WhatsApp ou de renvoyer le contexte de votre sélection.',
      },
      {
        q: 'Puis-je vous contacter par email ?',
        a: 'Oui. L’adresse de contact est indiquée dans le pied de page et sur les pages de contenu.',
      },
    ],
  },
];

function FaqGroup({ group, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E0DBD5] bg-white">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between bg-[#F8F5F0] px-5 py-4 text-left font-bold text-text-dark transition hover:bg-[#F1ECE6] sm:px-6"
        aria-expanded={isOpen}
      >
        {group.q}
        <span className={`text-accent transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>›</span>
      </button>
      <div className={`${isOpen ? 'block' : 'hidden'} divide-y divide-[#F1ECE6]`}>
        {group.items.map((item, i) => (
          <details key={i} className="group">
            <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-text-dark transition hover:text-accent sm:px-6">
              {item.q}
              <span className="ml-4 shrink-0 text-accent transition group-open:rotate-90">›</span>
            </summary>
            <p className="px-5 pb-4 text-sm leading-7 text-text-muted sm:px-6">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function FaqPage() {
  usePageTitle('FAQ — WORLD DESIGN');
  const [active, setActive] = useState(0);

  return (
    <div className="min-h-screen bg-cream">
      <section className="bg-primary py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            FAQ
          </p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Les réponses les plus utiles
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/75">
            Tout ce qu’il faut savoir pour explorer le catalogue, préparer votre sélection et envoyer
            votre demande dans de bonnes conditions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2 rounded-[20px] border border-[#E0DBD5] bg-white px-4 py-3 text-text-muted">
          <Search className="h-5 w-5 text-accent" />
          <span className="text-sm">
            Astuce: utilisez <kbd className="rounded border border-[#E0DBD5] bg-[#F8F5F0] px-1.5 py-0.5 text-xs">Ctrl+F</kbd>{' '}
            pour retrouver un sujet plus vite.
          </span>
        </div>

        <div className="space-y-4">
          {FAQ.map((group, i) => (
            <FaqGroup
              key={group.q}
              group={group}
              isOpen={active === i}
              onToggle={() => setActive(active === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-10 rounded-[28px] bg-primary p-8 text-center text-white">
          <h3 className="text-xl font-bold">Vous ne trouvez pas votre réponse ?</h3>
          <p className="mt-2 text-sm leading-7 text-white/70">
            Notre équipe reste joignable par WhatsApp ou email pour tout complément.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-4">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-6 py-2.5 font-semibold text-white transition hover:bg-accent/90"
            >
              WhatsApp
            </a>
            <a
              href="mailto:Worlddesign45@gmail.com"
              className="rounded-full border border-white/30 px-6 py-2.5 font-semibold text-white transition hover:bg-white/10"
            >
              Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
