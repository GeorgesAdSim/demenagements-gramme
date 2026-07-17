import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TipTapLink from '@tiptap/extension-link';
import TipTapImage from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import { useCallback, useState } from 'react';
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Quote,
  Link2, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Unlink, PanelTopOpen, ChevronUp,
} from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-md p-2 transition-colors text-xs ${
        active
          ? 'bg-[#132073] text-[#F0B800]'
          : 'bg-white text-[#333333] hover:bg-[#132073] hover:text-[#F0B800]'
      }`}
    >
      {children}
    </button>
  );
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TipTapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-[#132073] underline' },
      }),
      TipTapImage.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full h-auto my-4' },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CharacterCount.configure({ limit: 50000 }),
    ],
    content,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-headings:font-black prose-headings:uppercase prose-headings:text-[#132073] prose-p:text-[#333333] prose-a:text-[#132073] prose-blockquote:border-l-4 prose-blockquote:border-[#F0B800] prose-blockquote:bg-[#F4F2EE] prose-blockquote:italic prose-blockquote:pl-4 max-w-none min-h-[400px] p-6 lg:p-8 outline-none',
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prevUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL du lien :', prevUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const insertImage = useCallback((url: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src: url }).run();
    setShowMediaPicker(false);
  }, [editor]);

  if (!editor) return null;

  const chars = editor.storage.characterCount.characters();
  const words = editor.storage.characterCount.words();
  const readingMins = Math.max(1, Math.ceil(words / 200));

  return (
    <div>
      <div className="bg-[#F4F2EE] border border-[#E5E3DF] rounded-t-xl">
        <div className="flex items-center justify-between px-3 py-2">
          <button
            type="button"
            onClick={() => setToolbarOpen(!toolbarOpen)}
            className="flex items-center gap-2 text-[#132073] hover:text-[#F0B800] transition-colors rounded-lg px-2 py-1.5 hover:bg-white text-xs font-bold"
          >
            {toolbarOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <PanelTopOpen className="w-3.5 h-3.5" />}
            {toolbarOpen ? 'Masquer les outils' : 'Outils de formatage'}
          </button>
          <span className="text-[#85868C] text-xs">
            {chars.toLocaleString()} / 50 000
          </span>
        </div>

        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            toolbarOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-2 flex flex-wrap gap-1 border-t border-[#E5E3DF] pt-2">
            <div className="flex items-center gap-1">
              <ToolbarButton
                active={editor.isActive('heading', { level: 1 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Titre H1"
              >
                <span className="font-bold px-1">H1</span>
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive('heading', { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Titre H2"
              >
                <span className="font-bold px-1">H2</span>
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive('heading', { level: 3 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                title="Titre H3"
              >
                <span className="font-bold px-1">H3</span>
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive('paragraph')}
                onClick={() => editor.chain().focus().setParagraph().run()}
                title="Paragraphe"
              >
                <span className="font-bold px-1">P</span>
              </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-[#E5E3DF] mx-1 self-center" />

            <div className="flex items-center gap-1">
              <ToolbarButton
                active={editor.isActive('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Gras"
              >
                <Bold className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italique"
              >
                <Italic className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive('strike')}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Barre"
              >
                <Strikethrough className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-[#E5E3DF] mx-1 self-center" />

            <div className="flex items-center gap-1">
              <ToolbarButton
                active={editor.isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Liste"
              >
                <List className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Liste numérotée"
              >
                <ListOrdered className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive('blockquote')}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Citation"
              >
                <Quote className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-[#E5E3DF] mx-1 self-center" />

            <div className="flex items-center gap-1">
              <ToolbarButton
                active={editor.isActive('link')}
                onClick={setLink}
                title="Lien"
              >
                <Link2 className="w-4 h-4" />
              </ToolbarButton>
              {editor.isActive('link') && (
                <ToolbarButton
                  onClick={() => editor.chain().focus().unsetLink().run()}
                  title="Supprimer le lien"
                >
                  <Unlink className="w-4 h-4" />
                </ToolbarButton>
              )}
              <ToolbarButton
                onClick={() => setShowMediaPicker(true)}
                title="Image"
              >
                <ImageIcon className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-[#E5E3DF] mx-1 self-center" />

            <div className="flex items-center gap-1">
              <ToolbarButton
                active={editor.isActive({ textAlign: 'left' })}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                title="Aligner à gauche"
              >
                <AlignLeft className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive({ textAlign: 'center' })}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                title="Centrer"
              >
                <AlignCenter className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive({ textAlign: 'right' })}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                title="Aligner à droite"
              >
                <AlignRight className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="w-px h-6 bg-[#E5E3DF] mx-1 self-center" />

            <div className="flex items-center gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                title="Annuler"
              >
                <Undo className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                title="Rétablir"
              >
                <Redo className="w-4 h-4" />
              </ToolbarButton>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-t-0 border-[#E5E3DF] rounded-b-xl min-h-[420px]">
        <EditorContent editor={editor} />
      </div>

      <p className="text-[#85868C] text-[13px] mt-4">
        {chars.toLocaleString()} caractères &middot; {words.toLocaleString()} mots &middot; ~{readingMins} min de lecture
      </p>

      {showMediaPicker && (
        <MediaPickerModal
          onSelect={insertImage}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </div>
  );
}
