import { Component, OnInit } from '@angular/core';
import * as go from 'gojs';

const $ = go.GraphObject.make;

@Component({
  selector: 'flow_chart',
  templateUrl: './flow-chart.component.html',
  styleUrls: ['./flow-chart.component.scss'],
})
export class FlowChartComponent implements OnInit {
  constructor() {}
  
  myDiagram: go.Diagram = new go.Diagram;

  ngOnInit(): void {

    this.myDiagram = $(
      go.Diagram,
      'myDiagramDiv', // must name or refer to the DIV HTML element
      {
        LinkDrawn: this.showLinkLabel, // this DiagramEvent listener is defined below
        LinkRelinked: this.showLinkLabel,
        'undoManager.isEnabled': true, // enable undo & redo
      }
    );

    this.myDiagram.addDiagramListener('Modified', (e) => {
      var button = document.getElementById('SaveButton') as HTMLButtonElement;
      if (button) button.disabled = !this.myDiagram.isModified;
      var idx = document.title.indexOf('*');
      if (this.myDiagram.isModified) {
        if (idx < 0) document.title += '*';
      } else {
        if (idx >= 0) document.title = document.title.slice(0, idx);
      }
    });

    this.myDiagram.nodeTemplateMap.add(
      '',
      $(
        go.Node,
        'Table',
        this.nodeStyle(),
        $(
          go.Panel,
          'Auto',
          $(
            go.Shape,
            'Rectangle',
            { fill: '#282c34', stroke: '#00A9C9', strokeWidth: 3.5 },
            new go.Binding('figure', 'figure')
          ),
          $(
            go.TextBlock,
            this.textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true,
            },
            new go.Binding('text').makeTwoWay()
          )
        ),
        this.makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
        this.makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
        this.makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
        this.makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
      )
    );

    this.myDiagram.nodeTemplateMap.add(
      'Conditional',
      $(
        go.Node,
        'Table',
        this.nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        $(
          go.Panel,
          'Auto',
          $(
            go.Shape,
            'Diamond',
            { fill: '#282c34', stroke: '#00A9C9', strokeWidth: 3.5 },
            new go.Binding('figure', 'figure')
          ),
          $(
            go.TextBlock,
            this.textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true,
            },
            new go.Binding('text').makeTwoWay()
          )
        ),
        // four named ports, one on each side:
        this.makePort('T', go.Spot.Top, go.Spot.Top, false, true),
        this.makePort('L', go.Spot.Left, go.Spot.Left, true, true),
        this.makePort('R', go.Spot.Right, go.Spot.Right, true, true),
        this.makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
      )
    );

    this.myDiagram.nodeTemplateMap.add(
      'Start',
      $(
        go.Node,
        'Table',
        this.nodeStyle(),
        $(
          go.Panel,
          'Spot',
          $(go.Shape, 'Circle', {
            desiredSize: new go.Size(70, 70),
            fill: '#282c34',
            stroke: '#09d3ac',
            strokeWidth: 3.5,
          }),
          $(go.TextBlock, 'Start', this.textStyle(), new go.Binding('text'))
        ),
        // three named ports, one on each side except the top, all output only:
        this.makePort('L', go.Spot.Left, go.Spot.Left, true, false),
        this.makePort('R', go.Spot.Right, go.Spot.Right, true, false),
        this.makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
      )
    );

    this.myDiagram.nodeTemplateMap.add(
      'End',
      $(
        go.Node,
        'Table',
        this.nodeStyle(),
        $(
          go.Panel,
          'Spot',
          $(go.Shape, 'Circle', {
            desiredSize: new go.Size(60, 60),
            fill: '#282c34',
            stroke: '#DC3C00',
            strokeWidth: 3.5,
          }),
          $(go.TextBlock, 'End', this.textStyle(), new go.Binding('text'))
        ),
        // three named ports, one on each side except the bottom, all input only:
        this.makePort('T', go.Spot.Top, go.Spot.Top, false, true),
        this.makePort('L', go.Spot.Left, go.Spot.Left, false, true),
        this.makePort('R', go.Spot.Right, go.Spot.Right, false, true)
      )
    );

    // taken from https://unpkg.com/gojs@2.2.12/extensions/Figures.js:
    go.Shape.defineFigureGenerator('File', (shape, w, h) => {
      var geo = new go.Geometry();
      var fig = new go.PathFigure(0, 0, true); // starting point
      geo.add(fig);
      fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
      fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
      fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
      fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
      var fig2 = new go.PathFigure(0.75 * w, 0, false);
      geo.add(fig2);
      // The Fold
      fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h));
      fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
      geo.spot1 = new go.Spot(0, 0.25);
      geo.spot2 = go.Spot.BottomRight;
      return geo;
    });

    this.myDiagram.nodeTemplateMap.add(
      'Comment',
      $(
        go.Node,
        'Auto',
        this.nodeStyle(),
        $(go.Shape, 'File', {
          fill: '#282c34',
          stroke: '#DEE0A3',
          strokeWidth: 3,
        }),
        $(
          go.TextBlock,
          this.textStyle(),
          {
            margin: 8,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: 'center',
            editable: true,
          },
          new go.Binding('text').makeTwoWay()
        )
        // no ports, because no links are allowed to connect with a comment
      )
    );

    // replace the default Link template in the linkTemplateMap
    this.myDiagram.linkTemplate = $(
      go.Link, // the whole link panel
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        toShortLength: 4,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        resegmentable: true,
        // mouse-overs subtly highlight links:
        mouseEnter: (e, link: any) =>
          (link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)'),
        mouseLeave: (e, link: any) =>
          (link.findObject('HIGHLIGHT').stroke = 'transparent'),
        selectionAdorned: false,
      },
      new go.Binding('points').makeTwoWay(),
      $(
        go.Shape, // the highlight shape, normally transparent
        {
          isPanelMain: true,
          strokeWidth: 8,
          stroke: 'transparent',
          name: 'HIGHLIGHT',
        }
      ),
      $(
        go.Shape, // the link path shape
        { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
        new go.Binding('stroke', 'isSelected', (sel) =>
          sel ? 'dodgerblue' : 'gray'
        ).ofObject()
      ),
      $(
        go.Shape, // the arrowhead
        { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }
      ),
      $(
        go.Panel,
        'Auto', // the link label, normally not visible
        {
          visible: false,
          name: 'LABEL',
          segmentIndex: 2,
          segmentFraction: 0.5,
        },
        new go.Binding('visible', 'visible').makeTwoWay(),
        $(
          go.Shape,
          'RoundedRectangle', // the label shape
          { fill: '#F8F8F8', strokeWidth: 0 }
        ),
        $(
          go.TextBlock,
          'Yes', // the label
          {
            textAlign: 'center',
            font: '10pt helvetica, arial, sans-serif',
            stroke: '#333333',
            editable: true,
          },
          new go.Binding('text').makeTwoWay()
        )
      )
    );

    this.myDiagram.toolManager.linkingTool.temporaryLink.routing =
      go.Link.Orthogonal;
    this.myDiagram.toolManager.relinkingTool.temporaryLink.routing =
      go.Link.Orthogonal;

    //load
    this.myDiagram.model = go.Model.fromJson(
      (document.getElementById('mySavedModel') as HTMLTextAreaElement).value
    );

    const myPalette =
      $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
        {
          // Instead of the default animation, use a custom fade-down
          "animationManager.initialAnimationStyle": go.AnimationManager.None,
          "InitialAnimationStarting": this.animateFadeDown, // Instead, animate with this function

          nodeTemplateMap: this.myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
          model: new go.GraphLinksModel([  // specify the contents of the Palette
            { category: "Start", text: "Start" },
            { text: "Step" },
            { category: "Conditional", text: "???" },
            { category: "End", text: "End" },
            { category: "Comment", text: "Comment" }
          ])
        });    

  }

  showLinkLabel(e: any) {
    var label = e.subject.findObject('LABEL');
    if (label !== null)
      label.visible = e.subject.fromNode.data.category === 'Conditional';
  }

  nodeStyle() {
    return [
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      {
        locationSpot: go.Spot.Center,
      },
    ];
  }

  makePort(name: any, align: any, spot: any, output: any, input: any) {
    var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
    return $(go.Shape, {
      fill: 'transparent',
      strokeWidth: 0,
      width: horizontal ? NaN : 8,
      height: !horizontal ? NaN : 8,
      alignment: align,
      stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
      portId: name,
      fromSpot: spot,
      fromLinkable: output,
      toSpot: spot,
      toLinkable: input,
      cursor: 'pointer',
      mouseEnter: (e: any, port: any) => {
        if (!e.diagram.isReadOnly) port.fill = 'rgba(255,0,255,0.5)';
      },
      mouseLeave: (e: any, port: any) => (port.fill = 'transparent'),
    });
  }

  textStyle() {
    return {
      font: 'bold 11pt calibri, Lato, Helvetica, Arial, sans-serif',
      stroke: '#F8F8F8',
    };
  }

  animateFadeDown(e: any) {
    var diagram = e.diagram;
    var animation = new go.Animation();
    animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
    animation.easing = go.Animation.EaseOutExpo;
    animation.duration = 900;
    // Fade "down", in other words, fade in from above
    animation.add(diagram, 'position', diagram.position.copy().offset(0, 200), diagram.position);
    animation.add(diagram, 'opacity', 0, 1);
    animation.start();
  }

  load() {
    this.myDiagram.model = go.Model.fromJson((document.getElementById("mySavedModel")! as HTMLTextAreaElement).value);
  }

  save() {
    (document.getElementById("mySavedModel")! as HTMLTextAreaElement).value = this.myDiagram.model.toJson();
    this.myDiagram.isModified = false;
  }  

}
