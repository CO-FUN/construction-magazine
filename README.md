# Construction Website Content Generator

This is a Content Generator App for marketing to generate article(s) using Grok with a button click providing few mandatory inputs or by uploading excel file.

# Working locally

1. Install deps using `yarn` and run the app using `yarn dev`.


## Inputs required to work with the App

**_Grok Model and how to generate articles_**
Please choose desired model and whether you want to generate single/bulk articles.

### Single article generation

**_Article Name and Keywords_**: if you choose single article generation then input the desired values for `Article Name` and `Keywords`. Please refer example beneath the fields on how the fields should be filled up with.

**IT**

**_Additional Configuration_** choose `Number of headings/subheadings`, `Min.words per section`, `Number of FAQs`, `Language`, `tags`.

**DE**

**_Additional Configuration_** Input `Instructions`, `Target Group`.

### Bulk articles generation

1. Refer below structure how the inputs can be given in excel and choose upload,

**IT**

| Article Name   | Keywords                        | Language | Number of Headings | Number of FAQs | Minimum Number of Words | Tags           |
| -------------- | ------------------------------- | -------- | ------------------ | -------------- | ----------------------- | -------------- |
| taille de haie | construction, résiliation, prix | it       | 10                 | 5              | 1500                    | articleIT,2024 |

**DE**

| Article Name | Keywords          | Language | Instructions | Target Group |
| ------------ | ----------------- | -------- | ------------ | ------------ |
| articlename  | keyword1,keyword2 | de       | instructions | target group |
