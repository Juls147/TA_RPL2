import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* Set root variables for color palette */
  :root {
    // Main
    --main-bg-color: #141D1B;
    --second-bg-color: #111716;
    --main-interactive-component-color: #1C4641;
    --second-interactive-component-color: #143935;
    --last-interactive-component-color: #152D29;
    --main-border-color: #3A7B73;
    --second-border-color: #316760;
    --last-border-color: #26554F;
    --main-solid-color: #4C9188;
    --second-solid-color: #599D94;
    --main-text-color: #B6EDE4;
    --second-text-color: #84CAC0;

    // Optional
    --main-bg-color-optional: #1C1C1C;
    --second-bg-color-optional: #151515;
    --main-interactive-component-color-optional: #323232;
    --second-interactive-component-color-optional: #2B2B2B;
    --last-interactive-component-color-optional: #242424;
    --main-border-color-optional: #616161;
    --second-border-color-optional: #484848;
    --last-border-color-optional: #3B3B3B;
    --main-solid-color-optional: #7C7C7C;
    --second-solid-color-optional: #6F6F6F;
    --main-text-color-optional: #EEE;
    --second-text-color-optional: #B4B4B4;

    --shadow-color: rgba(0, 0, 0, 0.5);
    --transition: all .3s ease;
    --padding-button: 0.75rem 1.5rem;
    --padding-button-small: 0.5rem 1rem;
    --padding-product-card: 2rem;
    --padding-input: 0.75rem 1rem;
    --padding-input-small: 0.5rem;
    --padding: 5rem 0;
    --gap: 2.5rem;
    --small-gap: 1rem;
    --very-small-gap: 0.5rem;
    --h1: 2.4rem;
    --h2: 2rem;
    --h3: 1.6rem;
    --h4: 1.4rem;
    --h5: 1.2rem;
    --h6: 1rem;
    --min-calc: .1rem;
  }

  * {
    font-family: "Poppins", sans-serif;
  }

  /* Global Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    overflow-x: hidden;
    width: 100%;
    background-color: var(--main-bg-color);
    color: var(--main-text-color-optional);

    @media (max-width: 320px) {
        width: 320px;
    }

    @media (min-width: 1600px) {
        width: 1600px;
        margin: 0 auto;
    }
  }
`;

export default GlobalStyle;
