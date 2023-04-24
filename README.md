# README

### What is this repository for?

- **Client Name:** Evisort
- This repository is purely for custom JS & CSS that could not be created using the features avaiable in webflows designer e.g. carousels or complex animations.

- **Production URL:** https://evisort.com
- **Development URL:** https://evisort-d288ab-c6c65eaf2b154aa0786bb278.webflow.io/
- **Staging URL:** https://evisort-d288ab.webflow.io/ (this uses the same designer as the production URL, but you can test small changes in the designer by only publishing to this URL before publishing to the live domain - for larger changes always test on the development URL / designer first)

### Who do I talk to?

- **Best Client Contact:** Sibel Kurun (sibel.kurun@evisort.com)
- **Lead Developer:** Jess Leyland
- **Other Developers:** Tristan Sheen
- **Designer:** Moving Brands

### Hosting & DNS

- **What CMS is being used?** Webflow
- **Where is it hosted?** Webflow
- **Do we have DNS access?** No, we didnt need this previously as the DNS was already pointing at webflow.

### How do I get set up?

- **Working on development**
- To push changes development, push them to the "development" branch in github
- This will then be detected by netlify and pushed to https://development--evisort.netlify.app/main.js
- To check if changes have deployed you can login to our netlify account via our dev@ github account
- If you want to test these changes you can do them on the development server, login to our webflow and find the Alchemy Development Server (https://evisort-d288ab-c6c65eaf2b154aa0786bb278.webflow.io/ - in the evisort workspace),
- Go to project settings -> custom code, and make the alchemy custom JS & CSS script tag is pointing to the development server url above
- Test your changes by viewing the development site https://evisort-d288ab-c6c65eaf2b154aa0786bb278.webflow.io/

- **Deploying to production**
- To push changes to production, its similar to development, push them to the "master" branch in github
- This will then be detected by netlify and pushed to https://evisort.alchemy.construction/main.js
- To check if changes have deployed you can login to our netlify account via our dev@ github account
- You can then view your changes on https://www.evisort.com/

- **Working locally**
- To work locally run "npm mrun dev" in the root of the repo
- This will setup a local server which will generate http://localhost:3000/dist/main.js and will update each time you save js changes
- You will then need to change one of the webflow sites to point at your local main.js
- To do this go to project settings -> custom code and then change the alchemy custom JS & CSS script tag to point at this local main js file
- PLEASE NOTE - We probably only need to work locally or larger sites changes, as its a bit more complex to setup

- **Making JS or CSS Changes**
- Make these within the /src folder, styles are CSS rather than SASS
- Any CSS changes should preferebly be made using the webflow designer, this style sheet should only be used for styles that cannot be done in webflows designer
- The JS & CSS is all compiled into dist/main.js

- **About the setup**
- This is a basic setup with [ViteJs](https://vitejs.dev/) that you can use for your Webflow website.
  `jQuery` is already installed and declared as an external dependency.
- I'm using [Netlify](https://www.netlify.com/) to build and host the code because it's easy to use, free, and has serverless functions out of the box.
- Setup doc is [here](https://github.com/armandsalle/vite-javascript-webflow/blob/main/HowToUse_JS_EN.md)

### Webflow designer

- **Glossary**
- Elements - Each of the items you add to a page e.g. divs, links, headings, images etc
- Navigator - Where you view all the elements in page, basically your HTML / page layout
- Components - Re-usable elements or groups of elements that are used in multiple parts of the site (these have green boxes next to them in the navigator). To edit a component globally make sure to double click into it before editing, to override for a particular page you dont need to click into it.
- Collections - These are basically all groups of items (e.g. Post Types and Taxonomies). These are also used to create "collection list" elements which basically are grids that display a group of elements from a collection (like a wordpress get_posts query), collection list can also be filtered and sorted.
- Style Selectors - These are like css classes and can be used to style elements. You can re-use these e.g. we have setup ones for things like "heading 1" and you can also add overrides by adding futher style selectors e.g. you could have something like "heading 1 - blue" and override a particular element to be blue, but leave other elements with the "heading 1" style selector as is.

- **Style changes**
- Style changes should all be made within the styles editor on the right hand side of the designer
- Click on an element and see the styles for it appear on the right (under the paint brush tab)
- If you want to setup a style across all screensizes make sure to do this on the laptop screen (the one with the star next to it)
- After you have setup your default styles you can then override on large or small screens by clicking the different screen sizes in the top
- Make sure if you are editing an element and you only want the change to be made to that element that you add an additional style selector for the override and dont edit global style selectors such as "tile" as this will change all tiles.
- Once you've made a style change in the designer, always make sure to publish to the staging domain and test in the normal browser (e.g fully responsively as the designer only gives you specific screensizes)

- **Collection content changes**
- To edit collection conent / blog posts go to "collections" (the cylinder symbol) in the left hand menu
- In here you will see all of the collections e.g. "blog posts" or "resources"
- Clicking into one will allow you to see all of the collection items and then click to edit each one
- Clicking the cog that appears on hover will allow you edit the settings for each collection (e.g. add custom fields)
- To view a collection items page go to "pages" in the left hand menu, find the collection template and then in the top left change to the item you want to preview

- **Publishing changes**
- If you want to publish changes from the designer, you can do this by clicking "publish" in the top right of any page
- You can initally just publish to the staging URL by unchecking the production URL, this will allow you to do a quick test of a feature or send to the client to review before publishing to the production URL (we'd only recommend doing this for small changes, larger changes should be tested on the development server first)

### Other

- **Jetboost - filtering**
- We use a tool called jetboost for the filtering systems (and sorting) on the website
- This tool is used to filter / sort collection lists

- **Wistia videos**
- The client requested that in some parts of the site they could embed wistia videos
- An example of this can be seen on the "resources" collection where the user can enter a wistia embed ID to display a wistia video embed

- **Marketo Forms**
- The client requested we used marketo forms on the site, to do this we use a "embed" element and paste in the marketo embed code.
- To edit the embed code click on a embed in the designer and click to cog next to the element title.
- Embeds will not display within the designer, you will need to publish them to view / test them.
- Form styles are stored within style.css in this repo.

- **Gated Resources**
- Some resources are gated, this is all done using custom JS and a marketo form
- The same marketo form is used to gate all resources
- The client can select which are gated by check the "resource is gated" checkbox when editing collection items

### Bug Fixes

- Note here any unusual bug fixes we've had to make, that could re-occur or happen on another site and we may want to refer back to.
- These could be either plugin or code related.
- e.g.
- 03.01.2023 - Jess L - Fixed WPML plugin issue by enabling "lorem ipsum" checkbox in string translations page in admin
- 10.11.2022 - Paul M - Fixed JS bug on homepage, not sure why it occured, may re-occur.
