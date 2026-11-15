import React, { useState } from 'react';
import { BookOpen, FileText, PlayCircle, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface WisdomTabProps {
  soundEnabled: boolean;
}

type ResourceType = 'all' | 'article' | 'video';

interface ResourceItem {
  id: string;
  type: 'article' | 'video';
  tag: string;
  title: string;
  source: string;
  duration: string;
  summary: string;
  url: string;
}

const RESOURCES: ResourceItem[] = [
  {
    id: 'james-clear-positive',
    type: 'article',
    tag: 'Positive Thinking',
    title: 'How Positive Thinking Builds Your Skills and Work',
    source: 'James Clear',
    duration: '6 min read',
    summary:
      'Barbara Fredrickson’s research showing how positive thoughts broaden your attention and compound real skills over time.',
    url: 'https://jamesclear.com/positive-thinking',
  },
  {
    id: 'shawn-achor-ted',
    type: 'video',
    tag: 'Optimism',
    title: 'The Happy Secret to Better Work',
    source: 'Shawn Achor · TEDx',
    duration: '12 min watch',
    summary:
      'Why training an optimistic lens rewires the brain for higher focus, creativity, and steady follow-through.',
    url: 'https://www.youtube.com/watch?v=LqeAiz691-s',
  },
  {
    id: 'berkeley-optimism-goals',
    type: 'article',
    tag: 'Optimism & Goals',
    title: 'How Optimism Helps You Achieve Goals With Less Stress',
    source: 'UC Berkeley Greater Good',
    duration: '5 min read',
    summary:
      'Evidence on why constructive optimism keeps effort consistent and lowers stress during long pursuits.',
    url: 'https://greatergood.berkeley.edu/article/item/how_optimism_helps_you_achieve_goals_with_less_stress',
  },
  {
    id: 'doty-neuroscience-manifestation',
    type: 'video',
    tag: 'Manifestation',
    title: 'Mind Magic: The Neuroscience of Manifestation',
    source: 'Dr. James Doty · Stanford',
    duration: 'Talk & Interview',
    summary:
      'A Stanford neurosurgeon explains how calm attention, clear intention, and repetition reshape neural habits.',
    url: 'https://www.youtube.com/watch?v=hernqePRsNE',
  },
  {
    id: 'seligman-learned-optimism',
    type: 'article',
    tag: 'Mindset Shift',
    title: 'Practicing Learned Optimism',
    source: 'Psychology Today',
    duration: '5 min read',
    summary:
      'Martin Seligman’s method for shifting how you interpret setbacks so positive self-talk stays grounded and resilient.',
    url: 'https://www.psychologytoday.com/us/blog/beyond-school-walls/202409/practicing-learned-optimism',
  },
  {
    id: 'neville-goddard-assumption',
    type: 'video',
    tag: 'Power of Thought',
    title: 'Inner Conversations & The Law of Assumption',
    source: 'Neville Goddard · Lecture Archive',
    duration: 'Audio Talk',
    summary:
      'Classic talks on aligning your quiet daily assumptions with the life and work you are building.',
    url: 'https://www.youtube.com/watch?v=q8K1lTmvrmk',
  },
  {
    id: 'james-allen-thinketh',
    type: 'article',
    tag: 'Classic Book Text',
    title: 'As a Man Thinketh (Complete Text)',
    source: 'James Allen · 1903 Essay',
    duration: 'Classic Read',
    summary:
      'The timeless short book on how quiet daily thoughts shape character, action, and outer circumstances.',
    url: 'https://www.gutenberg.org/ebooks/4507',
  },
  {
    id: 'shawn-achor-summary',
    type: 'video',
    tag: 'Daily Habit',
    title: 'The Happiness Advantage in Two Minutes',
    source: 'Shawn Achor · Book Primer',
    duration: '2 min watch',
    summary:
      'A concise refresher on spotting positive momentum first thing each morning.',
    url: 'https://www.youtube.com/watch?v=CT8QUoqqXpo',
  },
];

export const WisdomTab: React.FC<WisdomTabProps> = ({ soundEnabled }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [filter, setFilter] = useState<ResourceType>('all');

  const manifestationSteps = [
    {
      title: 'Thoughts',
      hindi: 'विचार',
      summary: 'Where attention settles each morning, inner clarity quietly gathers.',
    },
    {
      title: 'Beliefs',
      hindi: 'विश्वास',
      summary: 'Daily practice turns a quiet intention into steady belief.',
    },
    {
      title: 'Acts',
      hindi: 'कर्म',
      summary: 'When belief settles in, daily action becomes natural.',
    },
    {
      title: 'Life',
      hindi: 'जीवन',
      summary: 'What is practiced quietly every day shapes reality over time.',
    },
  ];

  const filteredResources =
    filter === 'all' ? RESOURCES : RESOURCES.filter((item) => item.type === filter);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 pb-20 space-y-8 select-none">
      {/* Header */}
      <div className="text-left space-y-1.5">
        <h2 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight">
          Resources
        </h2>
        <p className="text-[15px] sm:text-[16px] text-[#9ca3ab] leading-relaxed">
          Articles and talks on optimism, positive thinking, and shaping life through thought.
        </p>
      </div>

      {/* Thought -> Life Framework */}
      <section className="space-y-3">
        <span className="text-[13px] font-bold uppercase tracking-wider text-[#ffd400] block">
          Thoughts → Beliefs → Acts → Life
        </span>

        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#16181c] rounded-2xl border border-[#2f3336]">
          {manifestationSteps.map((step, idx) => (
            <button
              key={step.title}
              type="button"
              onClick={() => {
                if (soundEnabled) sound.playMalaClick(0.15);
                setActiveStep(idx);
              }}
              className={`py-2.5 px-1 text-center rounded-xl transition cursor-pointer flex flex-col items-center ${
                activeStep === idx
                  ? 'bg-[#ffd400] text-black font-bold shadow-sm'
                  : 'text-[#9ca3ab] hover:text-white'
              }`}
            >
              <span className="text-[14px] sm:text-[15px] font-semibold leading-none">{step.title}</span>
              <span className="text-[13px] opacity-80 mt-1 font-devanagari">{step.hindi}</span>
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-[#16181c] border border-[#2f3336] space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] sm:text-[18px] font-bold text-white">
              {manifestationSteps[activeStep].title} ·{' '}
              <span className="font-devanagari font-normal text-[#e7e9ea]">
                {manifestationSteps[activeStep].hindi}
              </span>
            </h3>
            <span className="text-[13px] text-[#ffd400] font-mono tabular-nums">0{activeStep + 1} / 04</span>
          </div>

          <p className="text-[15px] sm:text-[16px] text-[#b0b6bc] leading-relaxed">
            {manifestationSteps[activeStep].summary}
          </p>
        </div>
      </section>

      {/* Curated Articles & Videos */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[13px] font-bold uppercase tracking-wider text-[#ffd400]">
            Curated Library
          </span>

          {/* Clean Filter Pills */}
          <div className="flex items-center gap-1 bg-[#16181c] p-1 rounded-full border border-[#2f3336]">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'article', label: 'Articles' },
                { id: 'video', label: 'Videos' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (soundEnabled) sound.playMalaClick(0.15);
                  setFilter(tab.id);
                }}
                className={`px-3.5 py-1 rounded-full text-[13px] sm:text-[14px] font-semibold transition-colors cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#ffd400] text-black font-bold'
                    : 'text-[#9ca3ab] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 sm:p-6 rounded-3xl bg-[#16181c] border border-[#2f3336] hover:border-[#ffd400]/45 transition-colors flex flex-col justify-between gap-4 text-left"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#ffd400] uppercase tracking-wider">
                    {item.type === 'video' ? (
                      <PlayCircle className="w-4 h-4" />
                    ) : item.id === 'james-allen-thinketh' ? (
                      <BookOpen className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span>{item.tag}</span>
                  </div>
                  <span className="text-[13px] text-[#9ca3ab] font-medium">{item.duration}</span>
                </div>

                <div>
                  <h4 className="text-[17px] sm:text-[18px] font-semibold text-white group-hover:text-[#ffd400] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[13px] sm:text-[14px] text-[#8e949a] mt-1 font-medium">{item.source}</p>
                </div>

                <p className="text-[15px] text-[#b0b6bc] leading-relaxed">{item.summary}</p>
              </div>

              <div className="pt-3 border-t border-[#2f3336]/60 flex items-center justify-between text-[14px] font-semibold text-[#e7e9ea] group-hover:text-[#ffd400] transition-colors">
                <span>{item.type === 'video' ? 'Watch video' : 'Read article'}</span>
                <ArrowUpRight className="w-4 h-4 text-[#9ca3ab] group-hover:text-[#ffd400] transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
