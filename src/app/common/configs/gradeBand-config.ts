import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GradeBandConfig {
  public static readonly academicGrades: string[] = ['PR', 'AP', 'SRF', 'RF', 'SL', 'LR', 'PDF', 'PTF', 'ST', 'T'];
  public static readonly professionalGrades: string[] = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];

  private static readonly gradeLevelMap: Array<any> = [
    { grade: 'PR', levels: '', },
    { grade: 'AP', levels: '', },
    { grade: 'SRF', levels: '8,7,6,5,4,3,2,1', },
    { grade: 'RF', levels: '7,6,5,4,3,2,1', },
    { grade: 'SL', levels: '8,7,6,5,4,3,2,1', },
    { grade: 'LR', levels: '7,6,5,4,3,2,1', },
    { grade: 'PTF', levels: '4,3,2,1', },
    { grade: 'ST', levels: '10,9,8,7,6,5,4,3,2,1', },
    { grade: 'T', levels: '4,3,2,1', },
    { grade: 'PDF', levels: '3,2,1', },
  ];

  public static getLevels(grade: string): string[] {
    let levels = GradeBandConfig.gradeLevelMap.find((item) => item.grade === grade)?.levels;
    return levels ? levels.split(',') : null;
  }

  public static getTopLevel(grade: string): number {
    let levels = GradeBandConfig.gradeLevelMap.find((item) => item.grade === grade)?.levels;
    if (levels) {
      let allLevels: number[] = levels.split(',').map((i) => +i);
      return Math.max(...allLevels);
    } else return null;
  }

  private static readonly gradeTitleMap: Array<any> = [
    { grade: 'PR', title: 'PR' },
    { grade: 'AP', title: 'AP' },
    { grade: 'SRF', title: 'SRF' },
    { grade: 'SL', title: 'SL' },
    { grade: 'RF', title: 'RF' },
    { grade: 'LR', title: 'L' },
    { grade: 'PTF', title: 'PTF' },
    { grade: 'ST', title: 'ST' },
    { grade: 'T', title: 'T' },
    { grade: 'PDF', title: 'PDF' },
  ];
  
  public static getGradeTitle(grade: string): string {
    return GradeBandConfig.gradeTitleMap.find((item) => item.grade === grade)?.title;
  }

  private static readonly psGradeMap: Array<any> = [
    { grade: 'PR', psGrade: 'PRS',  },
    { grade: 'AP', psGrade: 'APS',  },
    { grade: 'SRF', psGrade: 'SRS', },
    { grade: 'SL', psGrade: 'SLS',  },
    { grade: 'RF', psGrade: 'RFS',  },
    { grade: 'LR' , psGrade: 'LRS', },
    { grade: 'PTF', psGrade: 'PTS', },
    { grade: 'ST', psGrade: 'STS',  },
    { grade: 'T' , psGrade: 'TTS', },
    { grade: 'PDF' , psGrade: 'PDS', },
  ];

  public static toPsGrade(grade: string): string {
    return this.psGradeMap.find(i => i.grade == grade)?.psGrade;
  }
}
