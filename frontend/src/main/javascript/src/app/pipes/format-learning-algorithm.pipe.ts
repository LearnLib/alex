import { Pipe, PipeTransform } from '@angular/core';
import { learnAlgorithm } from '../constants';

@Pipe({
  name: 'formatLearningAlgorithm'
})
export class FormatLearningAlgorithmPipe implements PipeTransform {

  transform(value: string): string {
    switch (name) {
      case learnAlgorithm.LSTAR:
        return 'L*';
      case learnAlgorithm.DHC:
        return 'DHC';
      case learnAlgorithm.TTT:
        return 'TTT';
      case learnAlgorithm.DT:
        return 'Discrimination Tree';
      case learnAlgorithm.KEARNS_VAZIRANI:
        return 'Kearns Vazirani';
      default:
        return name;
    }
  }
}
