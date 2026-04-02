import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Pairs } from 'src/app/core/models/pairs.model';

@Injectable({
  providedIn: 'root'
})
export class AdminExerciseFormService {

  constructor(private formBuilder: FormBuilder) {}

  createExerciseGroup(exercise: any): FormGroup {
    let uniqueResponsesArray = this.formBuilder.array<FormGroup>([]);

    if (exercise?.UniqueResponses?.length) {

      const correct = exercise.UniqueResponses.find((u: any) => u.is_correct);
      const wrong = exercise.UniqueResponses.filter((u: any) => !u.is_correct);

      if (correct) {
        uniqueResponsesArray.push(
          this.formBuilder.group({
            id_response: [correct.id_response],
            content: [correct.content],
            is_correct: [true],
          })
        );
      } else {
        uniqueResponsesArray.push(
          this.formBuilder.group({
            id_response: [0],
            content: [''],
            is_correct: [true],
          })
        );
      }

      if (wrong?.length > 0) {
        wrong.forEach((u: any) => {
          uniqueResponsesArray.push(
            this.formBuilder.group({
              id_response: [u.id_response],
              content: [u.content],
              is_correct: [false],
            })
          );
        });
      } else {
        uniqueResponsesArray.push(
          this.formBuilder.group({
            id_response: [0],
            content: [''],
            is_correct: [false],
          })
        );
      }

    } else {
      uniqueResponsesArray.push(
        this.formBuilder.group({
          id_response: [0],
          content: [''],
          is_correct: [true],
        })
      );

      uniqueResponsesArray.push(
        this.formBuilder.group({
          id_response: [0],
          content: [''],
          is_correct: [false],
        })
      );
    }

    const isOrder = exercise?.type === 'ORDER';
    let orderText = '';

    if (isOrder && exercise?.PutInOrders?.length) {
      orderText = exercise.PutInOrders
        .sort((a: any, b: any) => a.correct_order - b.correct_order)
        .map((p: any) => p.content)
        .join(';');
    }

    return this.formBuilder.group({
      question: [exercise?.question ?? ''],
      type: [exercise?.type ?? 'UNIQUE'],
      feedback: [exercise?.feedback ?? ''],
      uniqueResponses: uniqueResponsesArray,

      pairs: this.formBuilder.array(
        this.mapPairsByKey(exercise?.Pairs ?? []).map((pair: any) =>
          this.formBuilder.group({
            pair_key: [pair.pair_key],
            content_left: [pair.content_left],
            content_right: [pair.content_right],
          })
        )
      ),

      putInOrders: this.formBuilder.array([]),
      orderText: [orderText],
    });
  }

  mapPairsByKey(pairs: Pairs[]): any[] {
    const grouped: any = {};

    pairs.forEach(pair => {
      if (!grouped[pair.pair_key]) {
        grouped[pair.pair_key] = {
          pair_key: pair.pair_key,
          content_left: '',
          content_right: ''
        };
      }

      if (!grouped[pair.pair_key].content_left) {
        grouped[pair.pair_key].content_left = pair.content;
      } else {
        grouped[pair.pair_key].content_right = pair.content;
      }
    });

    return Object.values(grouped);
  }

  addUniqueResponse(uniqueArray: FormArray): void {
    uniqueArray.push(
      this.formBuilder.group({
        id_response: [0],
        content: [''],
        is_correct: [false],
      })
    );
  }

  removeUniqueResponse(uniqueArray: FormArray, index: number): void {
    const control = uniqueArray.at(index);
    const isCorrect = control.get('is_correct')?.value;

    if (!isCorrect) {
      const wrongCount = uniqueArray.controls.filter(c => !c.get('is_correct')?.value).length;
      if (wrongCount <= 1) {
        return;
      }
    }

    uniqueArray.removeAt(index);
  }

  addPair(pairsArray: FormArray): void {
    pairsArray.push(
      this.formBuilder.group({
        content_left: [''],
        content_right: [''],
        pair_key: [this.generatePairKey()],
      })
    );
  }

  removePair(pairsArray: FormArray, index: number): void {
    pairsArray.removeAt(index);
  }

  private generatePairKey(): string {
    return 'pair_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
  }

  normalizeOrderExercises(formValue: any): any {
    formValue.pages.forEach((page: any) => {
      if (page.type === 'EXERCISE' && page.exercise.type === 'ORDER') {
        const segments = page.exercise.orderText
          .split(';')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);

        page.exercise.putInOrders = segments.map((content: string, index: number) => ({
          content,
          correct_order: index + 1,
          mixed_order: index + 1
        }));

        for (let i = page.exercise.putInOrders.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [page.exercise.putInOrders[i].mixed_order, page.exercise.putInOrders[j].mixed_order] =
            [page.exercise.putInOrders[j].mixed_order, page.exercise.putInOrders[i].mixed_order];
        }
      }
    });

    return formValue;
  }

  getOrderTextControl(pageGroup: FormGroup): FormControl {
    return pageGroup.get('exercise.orderText') as FormControl;
  }
}