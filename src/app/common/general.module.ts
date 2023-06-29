import { SummaryTableComponent } from './components/summary-table/summary-table.component';
import { PeopleTableComponent } from './components/people-table/people-table.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {PageHeaderComponent} from './components/page-header/page-header.component';
import {ProgressIndicatorComponent} from './components/progress-indicator/progress-indicator.component';
import {TableComponent} from './components/table/table.component';
import {SortByPipe} from './pipes/sortBy.pipe';
import {FilterPipe} from './pipes/filter.pipe';
import {GroupByPipe} from './pipes/groupBy.pipe';
import {MenuComponent} from './components/menu/menu.component';
import {CollapsableGridComponent} from './components/collapsable-grid/collapsable-grid.component';
import {SimpleTabsComponent} from './components/simple-tabs/simple-tabs.component';
import {EmojiPlaceholderComponent} from './components/emoji-placeholder/emoji-placeholder.component';
import {SelectPopOverComponent} from "./components/select/select-pop-over/select-pop-over.component";
import {SelectComponent} from "./components/select/select.component";
import {PieChartComponent} from "./components/charts/pie-chart/pie-chart.component";
import {StepsComponent} from "./components/steps/steps.component";
import {BarChartComponent} from "./components/charts/bar-chart/bar-chart.component";
import {IconButtonComponent} from "./components/icon-button/icon-button.component";
import {HexagonsComponent} from "./components/charts/hexagons/hexagons.component";
import {LineChartComponent} from "./components/charts/line-chart/line-chart.component";
import {BreadCrumbComponent} from "./components/bread-crumb/bread-crumb.component";
import {EnableActionDirective} from "./directives/enable-action.directive";
import { HeaderModule } from '../shared/components/header/header.module';
import { FooterModule } from './../shared/components/footer/footer.module';
import { LoadingIndicatorModule } from '../shared/components/loading-indicator/loading-indicator.module';
import { TabsComponent, TabComponent, TabHeaderDirective } from './components/tabs/tabs.component';

const components = [SortByPipe,
  FilterPipe,
  GroupByPipe,
  EnableActionDirective,
  MenuComponent,
  CollapsableGridComponent,
  SimpleTabsComponent,
  EmojiPlaceholderComponent,
  SelectComponent,
  SelectPopOverComponent,
  IconButtonComponent,
  PieChartComponent,
  LineChartComponent,
  BarChartComponent,
  HexagonsComponent,
  StepsComponent,
  PageHeaderComponent,
  BreadCrumbComponent,
  ProgressIndicatorComponent,
  TableComponent,
  TabsComponent, 
  TabComponent, 
  TabHeaderDirective,
  PeopleTableComponent,
  SummaryTableComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    HeaderModule, 
    FooterModule,
    LoadingIndicatorModule
  ],
  exports: [...components]
})
export class GeneralModule { }
