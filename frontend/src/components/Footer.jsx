import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, Share2, Send } from 'lucide-react';

const FOOTER_LINKS = [
  { to: '/products', label: 'Catalogue' },
  { to: '/ma-selection', label: 'Ma sélection' },
  { to: '/admin/login', label: 'Espace admin' },
];

const INFO_LINKS = [
  { to: '/info', label: 'À propos' },
  { to: '/faq', label: 'FAQ' },
  { to: '/conditions', label: "Conditions d'utilisation" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link to="/" aria-label="Accueil World Design">
              <img src="/logo-wd.png" alt="World Design" style={{ height: 72, width: 'auto' }} />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Catalogue premium de goodies personnalisés. Vous parcourez, vous préparez votre
              sélection, puis vous nous l’envoyez pour obtenir un devis clair.
            </p>
            <div className="mt-4 flex gap-3">
              {[Heart, Share2, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-accent hover:bg-accent hover:text-white"
                  aria-label={`Réseau social ${i + 1}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">Explorer</h4>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/70 transition hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">Informations</h4>
            <ul className="mt-4 space-y-2">
              {INFO_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/70 transition hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div id="footer-contact">
            <h4 className="text-sm font-bold text-white">Contact</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/70">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                Worlddesign45@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                +22892455800
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                Lomé, Togo
              </li>
            </ul>
            <p className="mt-3 text-xs text-white/50">
              WORLD DESIGN WD SARL U
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} WORLD DESIGN. Tous droits réservés.
          </p>
          <p className="inline-flex items-center gap-1 text-xs text-white/50">
            Fabriqué avec <Heart className="h-3 w-3 fill-accent/30 text-accent/30" /> au Togo
          </p>
        </div>
      </div>
    </footer>
  );
}
