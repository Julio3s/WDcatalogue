import { usePageTitle } from '../hooks/usePageTitle';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export default function TermsPage() {
  usePageTitle("Conditions d'utilisation — WORLD DESIGN");

  return (
    <div className="min-h-screen bg-cream">
      <section className="bg-primary py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            Conditions
          </p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Conditions d’utilisation
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/70">
            Les règles qui encadrent l’utilisation du catalogue et des fonctionnalités liées à la sélection.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <h2 className="text-xl font-bold text-text-dark">1. Objet du site</h2>
            <p className="mt-2 text-base leading-8 text-text-muted">
              WORLD DESIGN présente un catalogue numérique de produits personnalisés. Le site n’est pas une
              boutique en ligne et ne gère ni paiement ni réservation automatique.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-dark">2. Accès au catalogue</h2>
            <p className="mt-2 text-base leading-8 text-text-muted">
              Le catalogue est accessible librement. Aucun compte visiteur n’est requis pour parcourir les
              produits, constituer une sélection ou contacter l’équipe.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-dark">3. Sélection locale</h2>
            <p className="mt-2 text-base leading-8 text-text-muted">
              La sélection préparée par le visiteur reste stockée uniquement dans le navigateur de l’appareil
              utilisé. Elle n’est pas enregistrée dans la base de données du site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-dark">4. Contenus visuels</h2>
            <p className="mt-2 text-base leading-8 text-text-muted">
              Les images et vidéos servent à illustrer les produits. Le site s’efforce d’afficher des médias
              clairs, optimisés et cohérents avec l’expérience proposée.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-dark">5. Contact et transmission</h2>
            <p className="mt-2 text-base leading-8 text-text-muted">
              Les informations envoyées via WhatsApp ou email sont utilisées uniquement pour répondre à votre
              demande et préparer la suite du projet.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-dark">6. Disponibilité</h2>
            <p className="mt-2 text-base leading-8 text-text-muted">
              WORLD DESIGN peut mettre à jour le catalogue, retirer un produit ou ajuster un contenu à tout
              moment afin de garder la vitrine cohérente avec l’état réel des offres.
            </p>
          </div>

          <div className="rounded-[28px] border border-[#E0DBD5] bg-white p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <p className="text-sm text-text-muted">Une question sur ces conditions ?</p>
            <p className="mt-2 text-sm font-semibold text-text-dark">Worlddesign45@gmail.com</p>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
