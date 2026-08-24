/**
 * Product page templates, keyed by product slug.
 *
 * app/[location]/products/[product]/page.jsx looks a product up here, so one
 * route renders all eight products for all ten locations. Adding a product to
 * a location is a data edit in data/locations.js plus an entry here — no new
 * route, no new component.
 *
 * Educational Cards and Flash Cards are deliberately absent: the content doc
 * covers neither, so they stay master-only routes.
 */
import PremiumPlayingCardsTemplate from './PremiumPlayingCardsTemplate';
import PromotionalPlayingCardsTemplate from './PromotionalPlayingCardsTemplate';
import AdvertisementPlayingCardsTemplate from './AdvertisementPlayingCardsTemplate';
import CardGamesTemplate from './CardGamesTemplate';
import CorporatePlayingCardsTemplate from './CorporatePlayingCardsTemplate';
import SouvenirPlayingCardsTemplate from './SouvenirPlayingCardsTemplate';
import BrandedPlayingCardsTemplate from './BrandedPlayingCardsTemplate';
import PokerCardsTemplate from './PokerCardsTemplate';

export const PRODUCT_TEMPLATES = {
  'premium-playing-cards': PremiumPlayingCardsTemplate,
  'promotional-playing-cards': PromotionalPlayingCardsTemplate,
  'advertisement-playing-cards': AdvertisementPlayingCardsTemplate,
  'card-games': CardGamesTemplate,
  'corporate-playing-cards': CorporatePlayingCardsTemplate,
  'souvenir-playing-cards': SouvenirPlayingCardsTemplate,
  'branded-playing-cards': BrandedPlayingCardsTemplate,
  'poker-cards': PokerCardsTemplate,
};
