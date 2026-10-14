'use client';

import { MARSHMALLOW_GAME_URL } from '@domain/works/worksList';

import EmbedFrame from '@ui/molecules/embed-frame/EmbedFrame';

export default function MarshmallowGame() {
  return <EmbedFrame src={MARSHMALLOW_GAME_URL} title='Мини-игра «Зефирка»' />;
}
