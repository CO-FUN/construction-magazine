import { useState } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQAnswer {
  type: string;
  text: string;
  spans: any[];
}

interface FAQItem {
  question: string;
  answer: FAQAnswer[];
}

interface FAQSectionProps {
  items: FAQItem[];
}

export function FAQSection({ items }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-6 font-inter">
      {/* FAQ Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-professional-primary rounded-full md:mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-professional-primary font-inter">
          Domande Frequenti
        </h2>
        <p className="text-professional-accent text-lg font-inter">
          Le risposte alle domande più comuni sui lavori di ristrutturazione a Trento
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index} className="border border-border hover:shadow-md transition-all duration-300 bg-white">
            <div className="p-6">
              <Button
                variant="ghost"
                onClick={() => toggleItem(index)}
                className="w-full justify-between text-left p-0 h-auto font-semibold text-base md:text-lg hover:bg-transparent font-inter"
              >
                <span className="text-professional-primary pr-4">{item.question}</span>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-professional-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-professional-primary flex-shrink-0" />
                )}
              </Button>
              
              {openItems.includes(index) && (
                <div className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-300">
                  {item.answer.map((answer, answerIndex) => (
                    <p key={answerIndex} className="text-professional-secondary leading-relaxed text-justify font-inter">
                      {answer.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}