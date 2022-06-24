import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  tap,
} from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-response';
import { AccessService } from 'src/app/service/access.service';
import { OrgSet } from './interface/node';
import { SetForm } from './interface/set-form';

/*
export class TodoItemNode {
  id!: number;
  children!: TodoItemNode[];
  title!: string;
}
*/

export class TodoItemFlatNode {
  id!: number;
  item!: string;
  level!: number;
  expandable!: boolean;
}

s: AccessService;

let TREE_DATA: OrgSet[];
/*
[
  {
    id: 18,
    title: 'ROOT',
    children: []
  },
];
*/

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<OrgSet[]>([]);

  get data(): OrgSet[] {
    return this.dataChange.value;
  }

  constructor(private service: AccessService) {
    this.initialize();
  }

  initialize() {
    this.service.orgRoot$().subscribe(
      (x) => {
        TREE_DATA = x.data.orgSets!;
        const data = this.buildFileTree(TREE_DATA, 0);
        this.dataChange.next(data);
      },
      (err) => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification')
    );
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: OrgSet[], level: number): OrgSet[] {
    return obj;
  }

  /** Add an item to to-do list */
  insertItem(parent: OrgSet, name: string, id: number) {
    if (parent.children) {
      parent.children.push({ id: id, title: name } as OrgSet);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: OrgSet, name: string, id: number) {
    node.title = name;
    node.id = id;
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-root',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  providers: [ChecklistDatabase],
})
export class ChartComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>> | undefined;
  rootState$: Observable<AppState<CustomResponse>> | undefined;

  ngOnInit(): void {
    this.rootState$ = this.service.orgRoot$().pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      tap((res) => {
        TREE_DATA = res.appData.data.orgSets!;
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError(() => {
        return of({ dataState: DataState.ERROR_STATE });
      })
    );
  }

  flatNodeMap = new Map<number, OrgSet>();
  nodeMap = new Map<number, TodoItemFlatNode>();
  nestedNodeMap = new Map<OrgSet, TodoItemFlatNode>();
  selectedParent: TodoItemFlatNode | null = null;
  //newItemName = '';
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<OrgSet, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<OrgSet, TodoItemFlatNode>;

  checklistSelection = new SelectionModel<TodoItemFlatNode>(true);

  setForm: SetForm = { id: 0, title: '', children: '' };
  node!: OrgSet;

  constructor(
    private service: AccessService,
    private _database: ChecklistDatabase
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this.rootState$ = this.service.orgRoot$().pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      tap((res) => {
        TREE_DATA = res.appData.data.orgSets!;
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError(() => {
        return of({ dataState: DataState.ERROR_STATE });
      })
    );

    _database.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  getId = (node: TodoItemFlatNode) => node.id;

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: OrgSet): OrgSet[] => node.children!;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) =>
    _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: OrgSet, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.title
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.id = node.id!;
    flatNode.item = node.title!;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(node.id!, node);
    this.nodeMap.set(node.id!, flatNode);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  addNewItem(node: TodoItemFlatNode, children: string, id: number) {
    const parentNode = this.flatNodeMap.get(node.id!);
    this._database.insertItem(parentNode!, children, id);
    this.treeControl.expand(node);
  }

  saveNode(node: TodoItemFlatNode, itemValue: string, id: number) {
    const nestedNode = this.flatNodeMap.get(node.id!);
    this._database.updateItem(nestedNode!, itemValue, id);
  }

  setParent(node: OrgSet) {
    this.setForm.id = node.id!;
    this.setForm.title = node.item!;
    this.node = node;
  }

  saveParent() {
    if (this.setForm.id !== 0) {
      this.node.id = this.setForm.id;
      this.node.title = this.setForm.title;
    }
  }

  saveChild() {
    if (this.setForm.id !== 0) {
      let child: OrgSet = {
        title: this.setForm.children,
        parent: { id: this.node.id },
      };
      child = this.newChild(child);
    }
  }

  newChild(orgSet: OrgSet): any {
    this.appState$ = this.service.orgSet$(orgSet).pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      tap((res) => {
        
        let a: OrgSet = res.appData.data.orgSet!;
        let parent: OrgSet = this.flatNodeMap.get(this.node.id!)!;
        let b: TodoItemFlatNode = this.nodeMap.get(parent.id!)!;
        b.expandable = true;

        if(!parent.children){
          parent.children = [];
          let b: TodoItemFlatNode = this.nodeMap.get(parent.id!)!;
        }

        this.addNewItem(b,a.title!,a.id!);

      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError(() => {
        return of({ dataState: DataState.ERROR_STATE });
      })
    );
  }
}
