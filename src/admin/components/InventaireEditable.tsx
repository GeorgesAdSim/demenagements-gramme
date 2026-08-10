import { AlertTriangle } from 'lucide-react';
import {
  HIDDEN_CONTENT,
  ITEM_LABELS,
  VOLUME_TABLE,
  computeRoomVolumes,
} from '../../lib/volumeBareme';
import type { PieceAnalysee } from '../lib/estimations';

const REMPLISSAGES = [
  { value: 'vide', label: 'Vide' },
  { value: 'partiel', label: 'À moitié' },
  { value: 'plein', label: 'Plein' },
  { value: 'inconnu', label: 'Inconnu' },
];

function m3(v: number) {
  return `${v.toFixed(1)} m³`;
}

interface Props {
  pieces: PieceAnalysee[];
  onChange: (pieces: PieceAnalysee[]) => void;
}

/**
 * Édition de l'inventaire détecté : quantités et remplissage.
 *
 * Le volume n'est pas une réponse du modèle, c'est un calcul du barème à partir
 * de cette liste. Corriger ici produit donc un volume juste, là où saisir un
 * nombre de mètres cubes de tête revenait à refaire à la main le travail de
 * l'outil.
 *
 * Le remplissage n'est proposé que sur les meubles à contenu caché : ailleurs,
 * le barème l'ignore, et un sélecteur sans effet est pire qu'aucun sélecteur.
 * C'est pourtant là que se loge l'essentiel de l'incertitude — une armoire
 * comptée « inconnu » se voit appliquer 0,7 faute de mieux, alors que
 * l'opérateur voit sur la photo si elle est vide.
 *
 * Cette version ne permet ni d'ajouter ni de supprimer une ligne : elle couvre
 * les quantités fausses et les remplissages inconnus, qui sont les deux écarts
 * observés. L'ajout d'un objet oublié viendra ensuite.
 */
export default function InventaireEditable({ pieces, onChange }: Props) {
  function majItem(iPiece: number, iItem: number, patch: { qty?: number; fill?: string }) {
    onChange(
      pieces.map((p, ip) =>
        ip !== iPiece
          ? p
          : {
              ...p,
              items: p.items.map((it, ii) => (ii !== iItem ? it : { ...it, ...patch })),
            },
      ),
    );
  }

  if (!pieces.length) {
    return <p className="text-[#85868C] text-sm">Aucun détail enregistré.</p>;
  }

  return (
    <div className="space-y-3">
      {pieces.map((piece, iPiece) => {
        const { volumeMeubles, volumeCache } = computeRoomVolumes(piece.items);
        return (
          <div
            key={piece.id}
            className={`rounded-xl border p-3 ${piece.readable ? 'border-[#E5E3DF]' : 'border-red-200 bg-red-50'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-[#132073] text-sm">{piece.label}</p>
              <span className="text-[#85868C] text-xs">
                {m3(volumeMeubles)} + {m3(volumeCache)} caché
              </span>
            </div>

            {!piece.readable && (
              <p className="text-red-600 text-xs mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Analyse échouée{piece.error ? ` — ${piece.error}` : ''}
              </p>
            )}

            {piece.items.length === 0 ? (
              <p className="text-[#85868C] text-xs">Aucun objet détecté dans cette pièce.</p>
            ) : (
              <div className="space-y-1.5">
                {piece.items.map((item, iItem) => {
                  const cache = HIDDEN_CONTENT[item.id];
                  const inconnu = !VOLUME_TABLE[item.id];
                  return (
                    <div key={`${item.id}-${iItem}`} className="flex flex-wrap items-center gap-2 text-sm">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={item.qty}
                        onChange={(e) =>
                          majItem(iPiece, iItem, { qty: Math.max(0, Number(e.target.value) || 0) })
                        }
                        className="w-16 border border-[#E5E3DF] rounded-lg px-2 py-1 text-sm outline-none focus:border-[#132073]"
                        aria-label={`Quantité — ${ITEM_LABELS[item.id] || item.id}`}
                      />
                      <span className="text-[#333333] flex-1 min-w-[8rem]">
                        {ITEM_LABELS[item.id] || item.id}
                        {/* Un identifiant absent du barème est compté au tarif
                            « objet volumineux divers » : autant le dire. */}
                        {inconnu && (
                          <span className="ml-1 text-[#85868C] text-xs italic">hors barème</span>
                        )}
                        {item.note && (
                          <span className="ml-1 text-[#85868C] text-xs">— {item.note}</span>
                        )}
                      </span>
                      {cache ? (
                        <select
                          value={item.fill ?? 'inconnu'}
                          onChange={(e) => majItem(iPiece, iItem, { fill: e.target.value })}
                          className={`border rounded-lg px-2 py-1 text-xs outline-none focus:border-[#132073] ${
                            (item.fill ?? 'inconnu') === 'inconnu'
                              ? 'border-[#F0B800] bg-[#F0B800]/10 text-[#132073] font-bold'
                              : 'border-[#E5E3DF] text-[#333333]'
                          }`}
                          aria-label={`Remplissage — ${ITEM_LABELS[item.id] || item.id}`}
                        >
                          {REMPLISSAGES.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-[#85868C] text-xs w-[5.5rem]" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {piece.special_handling.length > 0 && (
              <p className="text-[#132073] text-xs mt-2 font-bold">
                Manutention : {piece.special_handling.join(', ')}
              </p>
            )}
            {piece.warnings.length > 0 && (
              <ul className="text-[#85868C] text-xs mt-1 list-disc list-inside">
                {piece.warnings.map((w, k) => (
                  <li key={k}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
