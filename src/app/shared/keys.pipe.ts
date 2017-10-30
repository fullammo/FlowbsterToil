import { Pipe, PipeTransform } from '@angular/core';

/**
 * A basic pipe to transform enumerable entities to their keys.
 * @example
 *  // use an enumerable entity and use its value.
 * <p>{{DistributionType | keys}}</p>
 */
@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  transform(value, args: string[]): any {
    const keys = [];
    for (const enumMember in value) {
      if (!isNaN(parseInt(enumMember, 10))) {
        keys.push({ key: enumMember, value: value[enumMember] });
        // Uncomment if you want log
        // console.log("enum member: ", value[enumMember]);
      }
    }
    return keys;
  }

}
