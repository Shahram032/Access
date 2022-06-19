import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Node } from './interface/node';
import { ExampleFlatNode } from './interface/example-flat-node';

const TREE_DATA: Node[] = [
  {
    name: 'وزارت کشور',
    children: [{name: 'ستاد',children:
    [
      {name:'حوزه وزیر'},
      {name:'معاونت سیاسی'},
      {name:'معاونت انتظامی'},
      {name:'معاونت عمرانی'}
    ]
  }],
  }
];

@Component({
  selector: 'app-root',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent {
  title = 'Tree';

  private _transformer = (node: Node, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );
  
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}
