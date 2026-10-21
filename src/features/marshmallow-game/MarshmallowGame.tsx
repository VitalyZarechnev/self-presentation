'use client';

import { useLocalized } from '@application/locale/LocaleProvider';

import { MARSHMALLOW_GAME_URL } from '@domain/works/worksList';

import EmbedFrame from '@ui/molecules/embed-frame/EmbedFrame';

const TITLE = { ru: 'Мини-игра «Зефирка»', en: 'Mini-game “Marshmallow”' } as const;

export default function MarshmallowGame() {
  return <EmbedFrame src={MARSHMALLOW_GAME_URL} title={useLocalized(TITLE)} />;
}
