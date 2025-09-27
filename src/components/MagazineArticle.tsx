import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Separator } from "./ui/Separator";
import { FAQSection } from "./FAQSection";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ArticleContent {
  type: string;
  text: string;
  spans: any[];
}

interface FAQItem {
  question: string;
  answer: ArticleContent[];
}

interface FAQSection {
  primary: {
    richtext_ref: string;
    kicker: any[];
    heading: any[];
    hide_faq_structured: boolean;
  };
  items: FAQItem[];
  slice_type: string;
  slice_label: string | null;
}

interface ArticleData {
  heading: ArticleContent[];
  content: ArticleContent[];
  body: FAQSection[];
  tags: string[];
  meta_data: {
    title: string;
    description: string;
    robots_index: string;
    robots_follow: string;
  }[];
}

interface MagazineArticleProps {
  data: ArticleData;
}

export function MagazineArticle({ data }: MagazineArticleProps) {
  const [copied, setCopied] = useState(false);

  const renderContent = (content: ArticleContent) => {
    switch (content.type) {
      case "heading1":
        return (
          <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
            {content.text}
          </h1>
        );
      case "heading2":
        return (
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 mt-12 leading-relaxed">
            {content.text}
          </h2>
        );
      case "heading3":
        return (
          <h3 className="text-xl md:text-2xl font-medium mb-4 mt-8 leading-relaxed">
            {content.text}
          </h3>
        );
      case "paragraph":
        return (
          <p className="font-paragraph md:text-lg leading-relaxed mb-6 text-justify">
            {content.text}
          </p>
        );
      default:
        return null;
    }
  };

  const componentCode = `import { MagazineArticle } from "@/components/MagazineArticle";

// Your article data
const articleData = ${JSON.stringify(data, null, 2)};

export default function YourPage() {
  return <MagazineArticle data={articleData} />;
}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(componentCode);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Article Container */}
        <Card className="shadow-lg border-none rounded-lg mx-auto">
          <div className="p-6 md:p-8 md:p-12 bg-white rounded-lg">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {data.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="border"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Main Heading */}
            {data.heading.map((heading, index) => (
              <div key={index}>
                {renderContent(heading)}
              </div>
            ))}

            <Separator className="my-8" />

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              {data.content.map((content, index) => (
                <div key={index} className="mb-4">
                  {renderContent(content)}
                </div>
              ))}
            </article>

            {/* FAQ Section */}
            {data.body.map((section, index) => {
              if (section.slice_type === "faq") {
                return (
                  <div key={index} className="mt-16">
                    <Separator className="mb-12" />
                    <FAQSection items={section.items} />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </Card>
        {/* Usage Instructions */}
        <div className="max-w-4xl mx-auto mt-12">
                                {/* Copy Button */}
        <div className="max-w-4xl mx-auto">
          <Button onClick={copyToClipboard} className="mb-4 cursor-pointer">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy article code
              </>
            )}
          </Button>
        </div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              How to use this component in your Next.js:
            </h3>
            <div className="p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                <code>{`// 1. Copy the MagazineArticle component files to your project
// 2. Import and use with your data:

import { MagazineArticle } from "@/components/MagazineArticle";

const yourData = {
  heading: [...],
  content: [...],
  body: [...],
  tags: [...],
  meta_data: [...]
};

export default function ArticlePage() {
  return <MagazineArticle data={yourData} />;
}`}</code>
              </pre>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
