import { IconTile, type IconTileTone } from '@usefaz/ui/components/icon-tile';
import {
  BookOpen,
  Brain,
  Calculator,
  Dumbbell,
  Earth,
  FlaskConical,
  GraduationCap,
  Landmark,
  Languages,
  Laptop,
  type LucideIcon,
  MessageCircleMore,
  Palette,
} from 'lucide-react';

// One icon and color per subject.
const SUBJECTS: Record<string, { icon: LucideIcon; tone: IconTileTone }> = {
  'Língua Portuguesa': { icon: BookOpen, tone: 'rose' },
  Matemática: { icon: Calculator, tone: 'blue' },
  Ciências: { icon: FlaskConical, tone: 'emerald' },
  História: { icon: Landmark, tone: 'amber' },
  Geografia: { icon: Earth, tone: 'teal' },
  Artes: { icon: Palette, tone: 'fuchsia' },
  'Educação Física': { icon: Dumbbell, tone: 'orange' },
  Inglês: { icon: Languages, tone: 'indigo' },
  Espanhol: { icon: MessageCircleMore, tone: 'red' },
  Informática: { icon: Laptop, tone: 'sky' },
  'Filosofia e Ética': { icon: Brain, tone: 'violet' },
};

const FALLBACK = { icon: GraduationCap, tone: 'slate' as const };

type SubjectIconProps = {
  subject: string;
  className?: string;
};

export default function SubjectIcon({ subject, className }: SubjectIconProps) {
  const { icon, tone } = SUBJECTS[subject] ?? FALLBACK;
  return <IconTile icon={icon} tone={tone} className={className} />;
}
