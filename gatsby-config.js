module.exports = {
  siteMetadata: {
    title: `Flatten the Curve Game!`,
    description: `Test your social distancing skills to lower the infection rate!`,
    author: `@ZakLaughton`,
    url: `https://flattenthecurve.zaklaughton.dev`,
    image: `/images/flatten-icon.png`,
    twitterUsername: "@ZakLaughton",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `flatten-the-curve`,
        short_name: `flatten`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/flatten-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
