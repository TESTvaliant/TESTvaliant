// website for testvaliant
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Heading2, 
  Heading3, 
  Quote, 
  Code, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Minus, 
  Undo, 
  Redo,
  Pilcrow,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter,
  Code2,
  Type,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  Plus,
  Trash2,
  RowsIcon,
  Columns
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from 'react';

// Custom FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
      },
    };
  },
});

const FONT_SIZES = [
  { label: 'Default', value: null },
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
  { label: '32px', value: '32px' },
  { label: '36px', value: '36px' },
  { label: '48px', value: '48px' },
];

const TEXT_COLORS = [
  { name: 'Default', color: null },
  { name: 'Black', color: '#000000' },
  { name: 'Dark Gray', color: '#4B5563' },
  { name: 'Gray', color: '#9CA3AF' },
  { name: 'Red', color: '#EF4444' },
  { name: 'Orange', color: '#F97316' },
  { name: 'Amber', color: '#F59E0B' },
  { name: 'Yellow', color: '#EAB308' },
  { name: 'Green', color: '#22C55E' },
  { name: 'Teal', color: '#14B8A6' },
  { name: 'Blue', color: '#3B82F6' },
  { name: 'Indigo', color: '#6366F1' },
  { name: 'Purple', color: '#A855F7' },
  { name: 'Pink', color: '#EC4899' },
];

const HIGHLIGHT_COLORS = [
  { name: 'None', color: null },
  { name: 'Yellow', color: '#FEF08A' },
  { name: 'Green', color: '#BBF7D0' },
  { name: 'Blue', color: '#BFDBFE' },
  { name: 'Purple', color: '#DDD6FE' },
  { name: 'Pink', color: '#FBCFE8' },
  { name: 'Orange', color: '#FED7AA' },
  { name: 'Red', color: '#FECACA' },
  { name: 'Gray', color: '#E5E7EB' },
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [textColorOpen, setTextColorOpen] = useState(false);
  const [highlightColorOpen, setHighlightColorOpen] = useState(false);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [htmlSource, setHtmlSource] = useState(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-border',
        },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border p-2',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-border p-2 bg-muted font-semibold',
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
    if (!showHtmlSource) {
      setHtmlSource(value);
    }
  }, [value, editor, showHtmlSource]);

  const toggleHtmlSource = useCallback(() => {
    if (showHtmlSource) {
      // Switching from HTML source to visual editor
      editor?.commands.setContent(htmlSource);
      onChange(htmlSource);
    } else {
      // Switching to HTML source
      setHtmlSource(editor?.getHTML() || value);
    }
    setShowHtmlSource(!showHtmlSource);
  }, [showHtmlSource, htmlSource, editor, onChange, value]);

  const handleHtmlSourceChange = useCallback((newHtml: string) => {
    setHtmlSource(newHtml);
    onChange(newHtml);
  }, [onChange]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    
    const url = window.prompt('Enter image URL:');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const tools = [
    { 
      icon: Pilcrow, 
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph'),
      title: "Paragraph" 
    },
    { 
      icon: Bold, 
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      title: "Bold" 
    },
    { 
      icon: Italic, 
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      title: "Italic" 
    },
    { 
      icon: UnderlineIcon, 
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      title: "Underline" 
    },
    { 
      icon: Heading2, 
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      title: "Heading 2" 
    },
    { 
      icon: Heading3, 
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      title: "Heading 3" 
    },
    { 
      icon: List, 
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      title: "Bullet List" 
    },
    { 
      icon: ListOrdered, 
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      title: "Numbered List" 
    },
    { 
      icon: Quote, 
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      title: "Quote" 
    },
    { 
      icon: Code, 
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      title: "Code" 
    },
    { 
      icon: SubscriptIcon, 
      action: () => editor.chain().focus().toggleSubscript().run(),
      isActive: editor.isActive('subscript'),
      title: "Subscript (e.g., H₂O)" 
    },
    { 
      icon: SuperscriptIcon, 
      action: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: editor.isActive('superscript'),
      title: "Superscript (e.g., x²)" 
    },
    { 
      icon: LinkIcon, 
      action: setLink,
      isActive: editor.isActive('link'),
      title: "Insert Link" 
    },
    { 
      icon: ImageIcon, 
      action: addImage,
      isActive: false,
      title: "Insert Image" 
    },
    { 
      icon: Minus, 
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
      title: "Horizontal Line" 
    },
  ];

  const getCurrentTextColor = () => {
    return editor.getAttributes('textStyle').color || null;
  };

  const getCurrentHighlightColor = () => {
    return editor.getAttributes('highlight').color || null;
  };

  const getCurrentFontSize = () => {
    return editor.getAttributes('textStyle').fontSize || null;
  };

  const alignmentTools = [
    { 
      icon: AlignLeft, 
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
      title: "Align Left" 
    },
    { 
      icon: AlignCenter, 
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
      title: "Align Center" 
    },
    { 
      icon: AlignRight, 
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
      title: "Align Right" 
    },
    { 
      icon: AlignJustify, 
      action: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: editor.isActive({ textAlign: 'justify' }),
      title: "Justify" 
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Content</label>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted rounded-t-md border border-b-0">
        {tools.map((tool, index) => (
          <Button
            key={index}
            type="button"
            variant={tool.isActive ? "secondary" : "ghost"}
            size="sm"
            className={cn("h-8 w-8 p-0", tool.isActive && "bg-secondary")}
            onClick={tool.action}
            title={tool.title}
          >
            <tool.icon className="w-4 h-4" />
          </Button>
        ))}
        
        <div className="w-px h-6 bg-border mx-1" />

        {alignmentTools.map((tool, index) => (
          <Button
            key={`align-${index}`}
            type="button"
            variant={tool.isActive ? "secondary" : "ghost"}
            size="sm"
            className={cn("h-8 w-8 p-0", tool.isActive && "bg-secondary")}
            onClick={tool.action}
            title={tool.title}
          >
            <tool.icon className="w-4 h-4" />
          </Button>
        ))}
        
        <div className="w-px h-6 bg-border mx-1" />

        {/* Font Size Picker */}
        <Popover open={fontSizeOpen} onOpenChange={setFontSizeOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 gap-1"
              title="Font Size"
            >
              <Type className="w-4 h-4" />
              <span className="text-xs hidden sm:inline min-w-[28px]">
                {getCurrentFontSize() || 'Size'}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-1" align="start">
            <div className="flex flex-col">
              {FONT_SIZES.map((sizeOption) => (
                <button
                  key={sizeOption.label}
                  type="button"
                  className={cn(
                    "px-3 py-1.5 text-left text-sm rounded hover:bg-muted transition-colors",
                    getCurrentFontSize() === sizeOption.value && "bg-muted font-medium"
                  )}
                  onClick={() => {
                    if (sizeOption.value) {
                      (editor.chain().focus() as any).setFontSize(sizeOption.value).run();
                    } else {
                      (editor.chain().focus() as any).unsetFontSize().run();
                    }
                    setFontSizeOpen(false);
                  }}
                >
                  {sizeOption.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Text Color Picker */}
        <Popover open={textColorOpen} onOpenChange={setTextColorOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 relative"
              title="Text Color"
            >
              <Palette className="w-4 h-4" />
              <div 
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-sm"
                style={{ backgroundColor: getCurrentTextColor() || 'currentColor' }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="grid grid-cols-7 gap-1">
              {TEXT_COLORS.map((colorOption) => (
                <button
                  key={colorOption.name}
                  type="button"
                  className={cn(
                    "w-6 h-6 rounded border border-border hover:scale-110 transition-transform",
                    !colorOption.color && "bg-gradient-to-br from-gray-200 to-gray-400"
                  )}
                  style={colorOption.color ? { backgroundColor: colorOption.color } : undefined}
                  title={colorOption.name}
                  onClick={() => {
                    if (colorOption.color) {
                      editor.chain().focus().setColor(colorOption.color).run();
                    } else {
                      editor.chain().focus().unsetColor().run();
                    }
                    setTextColorOpen(false);
                  }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Highlight Color Picker */}
        <Popover open={highlightColorOpen} onOpenChange={setHighlightColorOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive('highlight') ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 relative"
              title="Highlight Color"
            >
              <Highlighter className="w-4 h-4" />
              {getCurrentHighlightColor() && (
                <div 
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-sm"
                  style={{ backgroundColor: getCurrentHighlightColor() }}
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="grid grid-cols-5 gap-1">
              {HIGHLIGHT_COLORS.map((colorOption) => (
                <button
                  key={colorOption.name}
                  type="button"
                  className={cn(
                    "w-6 h-6 rounded border border-border hover:scale-110 transition-transform",
                    !colorOption.color && "bg-gradient-to-br from-gray-100 to-gray-300 relative"
                  )}
                  style={colorOption.color ? { backgroundColor: colorOption.color } : undefined}
                  title={colorOption.name}
                  onClick={() => {
                    if (colorOption.color) {
                      editor.chain().focus().setHighlight({ color: colorOption.color }).run();
                    } else {
                      editor.chain().focus().unsetHighlight().run();
                    }
                    setHighlightColorOpen(false);
                  }}
                >
                  {!colorOption.color && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">✕</span>
                  )}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="w-px h-6 bg-border mx-1" />

        {/* Table Menu */}
        <Popover open={tableMenuOpen} onOpenChange={setTableMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive('table') ? "secondary" : "ghost"}
              size="sm"
              className={cn("h-8 w-8 p-0", editor.isActive('table') && "bg-secondary")}
              title="Table"
            >
              <TableIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="flex flex-col gap-1">
              <button
                type="button"
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-left"
                onClick={() => {
                  editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                  setTableMenuOpen(false);
                }}
              >
                <Plus className="w-4 h-4" />
                Insert Table (3×3)
              </button>
              
              {editor.isActive('table') && (
                <>
                  <div className="h-px bg-border my-1" />
                  <button
                    type="button"
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-left"
                    onClick={() => {
                      editor.chain().focus().addRowBefore().run();
                      setTableMenuOpen(false);
                    }}
                  >
                    <RowsIcon className="w-4 h-4" />
                    Add Row Above
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-left"
                    onClick={() => {
                      editor.chain().focus().addRowAfter().run();
                      setTableMenuOpen(false);
                    }}
                  >
                    <RowsIcon className="w-4 h-4" />
                    Add Row Below
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-left"
                    onClick={() => {
                      editor.chain().focus().addColumnBefore().run();
                      setTableMenuOpen(false);
                    }}
                  >
                    <Columns className="w-4 h-4" />
                    Add Column Left
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-left"
                    onClick={() => {
                      editor.chain().focus().addColumnAfter().run();
                      setTableMenuOpen(false);
                    }}
                  >
                    <Columns className="w-4 h-4" />
                    Add Column Right
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    type="button"
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-left text-destructive"
                    onClick={() => {
                      editor.chain().focus().deleteRow().run();
                      setTableMenuOpen(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Row
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-left text-destructive"
                    onClick={() => {
                      editor.chain().focus().deleteColumn().run();
                      setTableMenuOpen(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Column
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors text-left text-destructive"
                    onClick={() => {
                      editor.chain().focus().deleteTable().run();
                      setTableMenuOpen(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Table
                  </button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo() || showHtmlSource}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* HTML Source Toggle */}
        <Button
          type="button"
          variant={showHtmlSource ? "secondary" : "ghost"}
          size="sm"
          className={cn("h-8 px-2 gap-1", showHtmlSource && "bg-secondary")}
          onClick={toggleHtmlSource}
          title={showHtmlSource ? "Switch to Visual Editor" : "View HTML Source"}
        >
          <Code2 className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">{showHtmlSource ? "Visual" : "HTML"}</span>
        </Button>
      </div>

      {/* Editor / HTML Source */}
      <div className="border rounded-b-md bg-background">
        {showHtmlSource ? (
          <Textarea
            value={htmlSource}
            onChange={(e) => handleHtmlSourceChange(e.target.value)}
            className="min-h-[200px] font-mono text-sm border-0 rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter HTML content..."
          />
        ) : (
          <EditorContent 
            editor={editor} 
            className="tiptap-editor"
          />
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;

