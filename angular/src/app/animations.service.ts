import { Injectable } from '@angular/core';
import { animation, style, animate, keyframes, AnimationReferenceMetadata } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class AnimationsService {
}
export const fadeInUpAnimation: AnimationReferenceMetadata = animation([
  style({
    visibility: 'hidden'
  }),
  animate('{{ duration }} {{ delay }}', keyframes([
    style({
      visibility: 'visible',
      opacity: 0,
      transform: 'translateY(200%)',
      easing: 'ease',
      offset: 0
    }),
    style({
      opacity: 1,
      transform: 'translateY(0)',
      easing: 'ease',
      offset: 1
    })
  ]))
], {
  params: {
    duration: '0.3s',
    delay: '0ms',
    distance: '25%'
  }
});

export const fadeOutUpAnimation: AnimationReferenceMetadata = animation([
  animate('{{ duration }} {{ delay }}', keyframes([
    style({
      opacity: 1,
      transform: 'translateY(0)',
      easing: 'ease',
      offset: 0
    }),
    style({
      opacity: 0,
      transform: 'translateY(-200%)', // Move upwards
      easing: 'ease',
      offset: 1,
      visibility: 'hidden' // Hide at the end
    })
  ]))
], {
  params: {
    duration: '0.3s',
    delay: '0ms',
    distance: '25%' // Not used in keyframes, but kept for consistency
  }
});