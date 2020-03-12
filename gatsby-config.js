module.exports = {
  siteMetadata: {
    title: `Election CVL Lycée Pasteur Unité Vergueiro`,
    description: `Site web pour les elections du Conseil de Vie Lycéene de la Fondation Lycée Pasteur unité Vergueiro, Sao Paulo - SP - Brésil`,
    author: `Victor Rosa Gomez ;D`,
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
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#003D7D`,
        theme_color: `#003D7D`,
        display: `minimal-ui`,
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        
      },
    },
    

  ],
}
