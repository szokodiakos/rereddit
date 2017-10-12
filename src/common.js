import numeral from 'numeral';
import moment from 'moment';
import ImagePost from '@/components/ImagePost';
import OtherPost from '@/components/OtherPost';
import VideoPost from '@/components/VideoPost';
import YoutubePost from '@/components/YoutubePost';
import SelfPost from '@/components/SelfPost';
import TwitchPost from '@/components/TwitchPost';
import StreamablePost from '@/components/StreamablePost';
import GfycatPost from '@/components/GfycatPost';

const postComponentsArray = [
  ImagePost,
  VideoPost,
  YoutubePost,
  SelfPost,
  TwitchPost,
  StreamablePost,
  GfycatPost,
];
postComponentsArray.push(OtherPost);

export const postComponents = postComponentsArray.reduce((state, c) => ({
  ...state,
  [c.component.name]: c.component,
}), {});

function format(n) {
  return (n > 1000 ? '0.0a' : '0a');
}

function getRGBComponents(color) {
  const r = color.substring(1, 3);
  const g = color.substring(3, 5);
  const b = color.substring(5, 7);

  return {
    R: parseInt(r, 16),
    G: parseInt(g, 16),
    B: parseInt(b, 16),
  };
}

export default {
  DEFAULT_COLOR: '#c0392b',
  formatNumber(n) {
    return numeral(n).format(format(n)).toUpperCase();
  },
  getTextColor(bgColor) {
    if (!bgColor) {
      return '#000000';
    }
    const nThreshold = 105;
    const components = getRGBComponents(bgColor);
    const bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

    return ((255 - bgDelta) < nThreshold) ? '#000000' : '#ffffff';
  },
  mod(n, m) {
    return ((n % m) + m) % m;
  },
  formatDate(date) {
    return moment.utc(parseInt(`${date}000`, 10)).fromNow();
  },
  handles(post) {
    const { component } = postComponentsArray.find(postComponent => postComponent.handles(post));
    return component.name;
  },
};
