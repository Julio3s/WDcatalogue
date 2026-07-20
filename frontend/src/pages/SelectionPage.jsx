import { useState } from 'react';
import { Link } from 'react-router-dom';

import { EmptyState } from '../components/EmptyState';
import { PageTransition } from '../components/PageTransition';
import { QuantitySelector } from '../components/QuantitySelector';
import { SectionHeading } from '../components/SectionHeading';
import { useSelectionStore } from '../store/selectionStore';
import { getWhatsAppNumber } from '../utils/whatsapp';

const WHATSAPP_NUMBER = getWhatsAppNumber();

export default function SelectionPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    updateCustomText,
    clearSelection,
    generateWhatsAppMessage,
  } = useSelectionStore();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (key) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleWhatsApp = () => {
    if (!WHATSAPP_NUMBER) return;
    const url = generateWhatsAppMessage(WHATSAPP_NUMBER);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#F6F1EA] py-10 sm:py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Ma sélection"
              title="Votre sélection est encore vide"
              description="Parcourez le catalogue, choisissez les pièces qui vous inspirent et revenez ici pour préparer votre demande."
            />
            <div className="mt-8">
              <EmptyState
                title="Aucun article ajouté"
                description="Dès que vous ajoutez un produit depuis le catalogue, il apparaîtra ici avec vos quantités et vos précisions."
                action={(
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Ouvrir le catalogue
                  </Link>
                )}
              />
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F6F1EA] py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[32px] border border-[#E5DDD4] bg-white shadow-[0_20px_60px_rgba(19,16,13,0.06)]">
            <div className="border-b border-[#F0E8DE] bg-gradient-to-br from-[#FFFDF8] via-[#FFF8F0] to-[#F7EFE4] px-6 py-8 sm:px-8 sm:py-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#A58A63]">
                    Préparation de sélection
                  </p>
                  <h1 className="mt-3 text-3xl font-black tracking-tight text-[#171311] sm:text-5xl">
                    Les pièces que vous souhaitez transmettre à l’équipe
                  </h1>
                  <p className="mt-4 max-w-xl text-base leading-8 text-[#6F6257]">
                    Ajustez les quantités, ajoutez vos indications de personnalisation, puis envoyez
                    l’ensemble en un seul message WhatsApp.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={clearSelection}
                    className="inline-flex items-center justify-center rounded-full border border-[#E5DDD4] bg-white px-5 py-3 text-sm font-semibold text-[#171311] transition hover:border-[#A58A63] hover:text-[#A58A63]"
                  >
                    Vider la sélection
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-8 px-6 py-6 sm:px-8 lg:grid-cols-[1.35fr_0.65fr] lg:py-8">
              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item.key}
                    className="overflow-hidden rounded-[28px] border border-[#EAE2D8] bg-white shadow-[0_10px_35px_rgba(19,16,13,0.04)]"
                  >
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                      <Link
                        to={`/products/${item.slug}`}
                        className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#F4EFE8]"
                      >
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#B9ADA0]">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/products/${item.slug}`}
                          className="text-lg font-semibold text-[#171311] transition hover:text-[#A58A63]"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-sm text-[#8D8175]">Réf. {item.reference}</p>
                        {item.modelValue ? (
                          <p className="text-sm text-[#8D8175]">Modèle : {item.modelValue}</p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-3">
                        <QuantitySelector quantity={item.quantity} onChange={(qty) => updateQuantity(item.key, qty)} />
                        <button
                          onClick={() => removeItem(item.key)}
                          className="rounded-full p-2 text-[#A9A095] transition hover:bg-red-50 hover:text-red-500"
                          title="Retirer"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {item.isCustomizable ? (
                      <div className="border-t border-[#F3EDE4] px-4 py-4 sm:px-5">
                        <button
                          onClick={() => toggleExpand(item.key)}
                          className="text-sm font-semibold text-[#A58A63] transition hover:text-[#8E734D]"
                        >
                          {expandedItems[item.key]
                            ? 'Masquer les informations complémentaires'
                            : 'Ajouter des informations complémentaires'}
                        </button>

                        {expandedItems[item.key] ? (
                          <textarea
                            value={item.customText}
                            onChange={(e) => updateCustomText(item.key, e.target.value)}
                            placeholder={item.customizationHint || 'Ajoutez ici vos indications de personnalisation...'}
                            className="mt-3 w-full resize-none rounded-2xl border border-[#E5DDD4] px-4 py-3 text-sm outline-none transition focus:border-[#171311]"
                            rows={4}
                          />
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>

              <aside className="h-fit rounded-[30px] border border-[#E5DDD4] bg-[#FCFAF6] p-6 shadow-[0_14px_45px_rgba(19,16,13,0.04)]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#A58A63]">
                  Récapitulatif
                </p>
                <div className="mt-4 rounded-[24px] bg-white p-5">
                  <p className="text-sm text-[#8D8175]">Articles sélectionnés</p>
                  <p className="mt-2 text-4xl font-black text-[#171311]">{totalItems}</p>
                  <p className="mt-2 text-sm leading-7 text-[#6F6257]">
                    Relisez vos choix, ajoutez une note si nécessaire et préparez un message clair
                    pour l’équipe.
                  </p>
                </div>

                <button
                  onClick={handleWhatsApp}
                  disabled={!WHATSAPP_NUMBER}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Envoyer la sélection sur WhatsApp
                </button>

                <Link
                  to="/products"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[#E5DDD4] bg-white px-6 py-3 text-sm font-semibold text-[#171311] transition hover:border-[#A58A63] hover:text-[#A58A63]"
                >
                  Retour au catalogue
                </Link>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
