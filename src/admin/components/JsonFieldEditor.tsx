import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const inputCls = 'w-full border border-[#E5E3DF] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#132073] bg-white';
const labelCls = 'block text-[13px] font-bold text-[#132073] mb-1';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

export function TextField({ label, value, onChange, multiline, placeholder }: TextFieldProps) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {multiline ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-none`} placeholder={placeholder} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder={placeholder} />
      )}
    </div>
  );
}

interface ListFieldProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function ListField({ label, items, onChange, placeholder }: ListFieldProps) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-[#85868C] flex-shrink-0" />
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className={`${inputCls} flex-1`}
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="flex items-center gap-1 text-[#132073] text-sm font-bold hover:text-[#F0B800] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>
    </div>
  );
}

interface ObjectListFieldProps<T extends Record<string, unknown>> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  fields: Array<{ key: keyof T; label: string; multiline?: boolean; placeholder?: string }>;
  defaultItem: T;
}

export function ObjectListField<T extends Record<string, unknown>>({
  label,
  items,
  onChange,
  fields,
  defaultItem,
}: ObjectListFieldProps<T>) {
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    const next = new Set(collapsed);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setCollapsed(next);
  };

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="space-y-3">
        {items.map((item, i) => {
          const isCollapsed = collapsed.has(i);
          const preview = String(item[fields[0].key] || `Item ${i + 1}`);
          return (
            <div key={i} className="border border-[#E5E3DF] rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between px-3 py-2 bg-[#F4F2EE] cursor-pointer"
                onClick={() => toggle(i)}
              >
                <span className="text-sm font-bold text-[#132073] truncate">{preview}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(items.filter((_, j) => j !== i));
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {!isCollapsed && (
                <div className="p-3 space-y-3">
                  {fields.map((f) => (
                    <div key={String(f.key)}>
                      <label className="block text-xs text-[#85868C] mb-1">{f.label}</label>
                      {f.multiline ? (
                        <textarea
                          rows={2}
                          value={String(item[f.key] ?? '')}
                          onChange={(e) => {
                            const next = [...items];
                            next[i] = { ...next[i], [f.key]: e.target.value };
                            onChange(next);
                          }}
                          className={`${inputCls} resize-none text-xs`}
                          placeholder={f.placeholder}
                        />
                      ) : (
                        <input
                          type="text"
                          value={String(item[f.key] ?? '')}
                          onChange={(e) => {
                            const next = [...items];
                            next[i] = { ...next[i], [f.key]: e.target.value };
                            onChange(next);
                          }}
                          className={`${inputCls} text-xs`}
                          placeholder={f.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => onChange([...items, { ...defaultItem }])}
          className="flex items-center gap-1 text-[#132073] text-sm font-bold hover:text-[#F0B800] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#E5E3DF] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 bg-[#F4F2EE] text-left"
      >
        <span className="font-bold text-[#132073] text-sm uppercase tracking-wider">{title}</span>
        <span className="text-[#85868C] text-xs">{open ? 'Fermer' : 'Ouvrir'}</span>
      </button>
      {open && <div className="p-5 space-y-4 bg-white">{children}</div>}
    </div>
  );
}
