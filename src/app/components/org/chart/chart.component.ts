import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { OrgSet } from './interface/node';
import { ExampleFlatNode } from './interface/example-flat-node';

const TREE_DATA: OrgSet[] = [
  { id: 1, title: 'وزارت نفت' , children:[{ id: 8,title:'معاونت'}]},
  { id: 2, title: 'وزارت راه و شهرسازی' },
  { id: 3, title: 'وزارت بهداشت' },
  { id: 4, title: 'وزارت علوم تحقیقات' },
  { id: 5, title: 'وزارت آموزش و پرورش' },
  { id: 6, title: 'وزارت جهاد کشاورزی' },
  { id: 7, title: 'وزارت کار و امور اجتماعی' },
];

@Component({
  selector: 'app-root',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  title = 'Tree';

  private _transformer = (node: OrgSet, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.title,
      level: level,
      id: node.id
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  setParent(node: ExampleFlatNode) {
    node.name = 'test';
  }
}
