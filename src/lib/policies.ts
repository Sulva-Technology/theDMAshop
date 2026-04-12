export const POLICY_ROUTES = {
  refund: '/policies/refund',
  shipping: '/policies/shipping',
  privacy: '/policies/privacy',
  terms: '/policies/terms',
  cookies: '/policies/cookies',
} as const;

export const POLICY_PAGES = {
  refund: {
    title: 'Refund policy',
    description: 'Returns are accepted within 30 days of delivery for unworn items in original condition.',
    sections: [
      {
        heading: 'Returns window',
        body: 'You can request a return within 30 days of delivery. Items must be unworn, unwashed, and returned with original tags and packaging.',
      },
      {
        heading: 'Refund timing',
        body: 'Approved refunds are sent back to your original payment method after the return is received and inspected. Banks can take a few business days to post the refund.',
      },
      {
        heading: 'Non-returnable items',
        body: 'Final-sale items, gift cards, and products that show signs of wear or damage after delivery are not eligible for refund.',
      },
    ],
  },
  shipping: {
    title: 'Shipping policy',
    description: 'Standard shipping is free on qualifying orders, with express delivery available at checkout.',
    sections: [
      {
        heading: 'Processing time',
        body: 'Orders are typically processed within 1 to 2 business days. During launches or holidays, processing can take a little longer.',
      },
      {
        heading: 'Delivery options',
        body: 'Standard shipping usually arrives in 3 to 5 business days. Express shipping usually arrives in 1 to 2 business days after dispatch.',
      },
      {
        heading: 'Tracking',
        body: 'A tracking email is sent as soon as your order ships so you can follow every step of delivery.',
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    description: 'We collect only the information needed to fulfill orders, support customers, and improve the store experience.',
    sections: [
      {
        heading: 'What we collect',
        body: 'We collect details such as your name, email address, shipping address, and order history when you browse, create an account, or place an order.',
      },
      {
        heading: 'How we use it',
        body: 'Your information is used to process payments, ship orders, provide customer support, and send transactional updates related to your purchases.',
      },
      {
        heading: 'Sharing',
        body: 'We share data only with trusted providers needed to run the store, such as payment processors, logistics partners, and analytics tools.',
      },
    ],
  },
  terms: {
    title: 'Terms of service',
    description: 'By using the store, you agree to follow these purchase, account, and site usage terms.',
    sections: [
      {
        heading: 'Orders',
        body: 'All orders are subject to availability and confirmation. We reserve the right to cancel or limit any order when inventory, pricing, or fraud checks require it.',
      },
      {
        heading: 'Accounts',
        body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity that happens under your account.',
      },
      {
        heading: 'Store content',
        body: 'All site content, branding, imagery, and product copy remain the property of the store and may not be reused without permission.',
      },
    ],
  },
  cookies: {
    title: 'Cookie settings',
    description: 'Cookies help keep the storefront secure, remember preferences, and improve performance.',
    sections: [
      {
        heading: 'Essential cookies',
        body: 'These cookies are required for core features like cart persistence, authentication, and checkout security.',
      },
      {
        heading: 'Performance cookies',
        body: 'We may use analytics cookies to understand how visitors use the store and to improve speed, usability, and merchandising.',
      },
      {
        heading: 'Controls',
        body: 'You can manage cookies through your browser settings. Disabling some cookies may affect parts of the shopping experience.',
      },
    ],
  },
} as const;

export type PolicySlug = keyof typeof POLICY_PAGES;
