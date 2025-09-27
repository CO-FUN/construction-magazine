import { Anchor, Content } from '../steps/types';

//forming anchor text for content JSON
//forming anchors with id and text to be added in anchorJSON
export const getUpdatedContentAndAnchor = (
  contentData: Content[]
): { updatedContent: Content[]; anchorJSON: Anchor[] } => {
  let heading2Index = 0;
  const updatedContent: Content[] = [];
  const anchorJSON: Anchor[] = [];

  contentData.forEach((contentItem) => {
    if (contentItem?.type === 'heading2') {
      heading2Index++;
      const anchorid = `anchor${heading2Index}`;
      //content part
      updatedContent.push({
        ...contentItem,
        text: `#${anchorid} ${contentItem.text}`,
      });
      //anchor part
      anchorJSON.push({
        id: `${anchorid}`,
        text: `${contentItem.text}`,
      });
    } else {
      updatedContent.push(contentItem);
    }
  });

  return { updatedContent, anchorJSON };
};
