<template>
  <div id="app">
    <div class="container">
      <!-- 创建一个canvas画布 npmn-js是通过canvas实现绘图的，并设置ref让vue获取到element -->
      <div class="bpmn-container">
        <div class="bpmn-canvas" ref="canvas"></div>
        <!-- 工具栏显示的地方 -->
        <div class="bpmn-js-properties-panel" id="js-properties-panel"></div>
      </div>

      <!-- 把操作按钮写在这里面 -->
      <div class="action1">
        <el-button icon="el-icon-document" @click="newTemplateFn(1)">简单流程</el-button>
        <el-button icon="el-icon-document" @click="newTemplateFn(2)">多条件流程</el-button>
      </div>
      <div class="action">
        <el-upload action class="upload-demo" :before-upload="openBpmn">
          <el-button icon="el-icon-folder-opened">导入</el-button>
        </el-upload>
        <el-button class="new" icon="el-icon-circle-plus" @click="newDiagram">新建</el-button>
        <el-button icon="el-icon-document" @click="getXmlData">获取xml数据</el-button>
        <el-button icon="el-icon-download" @click="downloadBpmn">导出bpmn标准xml</el-button>
        <el-button icon="el-icon-picture" @click="downloadSvg">导出svg</el-button>
        <a hidden ref="downloadLink"></a>
      </div>
    </div>
  </div>
</template>

<script>
import BpmnModeler from "bpmn-js/lib/Modeler";
// 工具栏相关
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import propertiesPanelModule from "bpmn-js-properties-panel";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";

// 汉化
import customTranslate from "@/components/bpmn/customTranslate";

export default {
  data() {
    return {
      bpmnModeler: null,
      canvas: null,
      bpmnTemplate: `<?xml version="1.0" encoding="UTF-8"?> <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="8.0.0"> <process id="Process_1" isExecutable="false"> <startEvent id="StartEvent_1y45yut" name="开始" /> </process> <bpmndi:BPMNDiagram id="BpmnDiagram_1"> <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1"> <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut"> <omgdc:Bounds x="152" y="102" width="36" height="36" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="160" y="145" width="22" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNShape> </bpmndi:BPMNPlane> </bpmndi:BPMNDiagram> </definitions>`,
      bpmnTemplate1:`<?xml version="1.0" encoding="UTF-8"?> <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="8.0.0"> <process id="Process_1" isExecutable="false"> <startEvent id="StartEvent_1y45yut" name="开始"> <outgoing>Flow_1nawael</outgoing> </startEvent> <sequenceFlow id="Flow_1nawael" sourceRef="StartEvent_1y45yut" targetRef="Activity_0wwvrj0" /> <endEvent id="Event_09z566u" name="结束"> <incoming>Flow_0p2w58i</incoming> </endEvent> <sequenceFlow id="Flow_0p2w58i" sourceRef="Activity_0wwvrj0" targetRef="Event_09z566u" /> <userTask id="Activity_0wwvrj0" name="标题"> <incoming>Flow_1nawael</incoming> <outgoing>Flow_0p2w58i</outgoing> </userTask> </process> <bpmndi:BPMNDiagram id="BpmnDiagram_1"> <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1"> <bpmndi:BPMNEdge id="Flow_1nawael_di" bpmnElement="Flow_1nawael"> <di:waypoint x="188" y="120" /> <di:waypoint x="240" y="120" /> </bpmndi:BPMNEdge> <bpmndi:BPMNEdge id="Flow_0p2w58i_di" bpmnElement="Flow_0p2w58i"> <di:waypoint x="340" y="120" /> <di:waypoint x="392" y="120" /> </bpmndi:BPMNEdge> <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut"> <omgdc:Bounds x="152" y="102" width="36" height="36" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="160" y="145" width="22" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNShape> <bpmndi:BPMNShape id="Event_09z566u_di" bpmnElement="Event_09z566u"> <omgdc:Bounds x="392" y="102" width="36" height="36" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="399" y="145" width="22" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNShape> <bpmndi:BPMNShape id="Activity_1fx5mli_di" bpmnElement="Activity_0wwvrj0"> <omgdc:Bounds x="240" y="80" width="100" height="80" /> </bpmndi:BPMNShape> </bpmndi:BPMNPlane> </bpmndi:BPMNDiagram> </definitions>`,
      bpmnTemplate2:`<?xml version="1.0" encoding="UTF-8"?> <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="8.0.0"> <process id="Process_1" isExecutable="false"> <startEvent id="StartEvent_1y45yut" name="开始"> <outgoing>Flow_1hocfks</outgoing> </startEvent> <exclusiveGateway id="Gateway_1kk5gkb" name="网关"> <incoming>Flow_1hocfks</incoming> <outgoing>Flow_0kkkshz</outgoing> <outgoing>Flow_09c59r8</outgoing> </exclusiveGateway> <sequenceFlow id="Flow_1hocfks" sourceRef="StartEvent_1y45yut" targetRef="Gateway_1kk5gkb" /> <sequenceFlow id="Flow_0kkkshz" name="条件" sourceRef="Gateway_1kk5gkb" targetRef="Activity_1qr1a0b" /> <userTask id="Activity_1qr1a0b" name="标题"> <incoming>Flow_0kkkshz</incoming> <outgoing>Flow_1fibynt</outgoing> </userTask> <sequenceFlow id="Flow_09c59r8" name="条件" sourceRef="Gateway_1kk5gkb" targetRef="Activity_1oi4a1z" /> <userTask id="Activity_1oi4a1z" name="标题"> <incoming>Flow_09c59r8</incoming> <outgoing>Flow_0hat1sp</outgoing> </userTask> <endEvent id="Event_03ft7o8" name="结束"> <incoming>Flow_1fibynt</incoming> </endEvent> <sequenceFlow id="Flow_1fibynt" sourceRef="Activity_1qr1a0b" targetRef="Event_03ft7o8" /> <endEvent id="Event_178ziaq" name="结束"> <incoming>Flow_0hat1sp</incoming> </endEvent> <sequenceFlow id="Flow_0hat1sp" sourceRef="Activity_1oi4a1z" targetRef="Event_178ziaq" /> </process> <bpmndi:BPMNDiagram id="BpmnDiagram_1"> <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1"> <bpmndi:BPMNEdge id="Flow_0hat1sp_di" bpmnElement="Flow_0hat1sp"> <di:waypoint x="490" y="380" /> <di:waypoint x="592" y="380" /> </bpmndi:BPMNEdge> <bpmndi:BPMNEdge id="Flow_1fibynt_di" bpmnElement="Flow_1fibynt"> <di:waypoint x="490" y="140" /> <di:waypoint x="592" y="140" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="530" y="12" width="22" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNEdge> <bpmndi:BPMNEdge id="Flow_09c59r8_di" bpmnElement="Flow_09c59r8"> <di:waypoint x="280" y="275" /> <di:waypoint x="280" y="380" /> <di:waypoint x="390" y="380" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="325" y="363" width="22" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNEdge> <bpmndi:BPMNEdge id="Flow_0kkkshz_di" bpmnElement="Flow_0kkkshz"> <di:waypoint x="280" y="225" /> <di:waypoint x="280" y="140" /> <di:waypoint x="390" y="140" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="324" y="122" width="22" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNEdge> <bpmndi:BPMNEdge id="Flow_1hocfks_di" bpmnElement="Flow_1hocfks"> <di:waypoint x="148" y="250" /> <di:waypoint x="255" y="250" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="280" y="194" width="22" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNEdge> <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut"> <omgdc:Bounds x="112" y="232" width="36" height="36" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="120" y="275" width="22" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNShape> <bpmndi:BPMNShape id="Gateway_1kk5gkb_di" bpmnElement="Gateway_1kk5gkb" isMarkerVisible="true"> <omgdc:Bounds x="255" y="225" width="50" height="50" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="308" y="243" width="23" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNShape> <bpmndi:BPMNShape id="Activity_1hhg9xi_di" bpmnElement="Activity_1qr1a0b"> <omgdc:Bounds x="390" y="100" width="100" height="80" /> </bpmndi:BPMNShape> <bpmndi:BPMNShape id="Event_03ft7o8_di" bpmnElement="Event_03ft7o8"> <omgdc:Bounds x="592" y="122" width="36" height="36" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="599" y="165" width="22" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNShape> <bpmndi:BPMNShape id="Event_178ziaq_di" bpmnElement="Event_178ziaq"> <omgdc:Bounds x="592" y="362" width="36" height="36" /> <bpmndi:BPMNLabel> <omgdc:Bounds x="599" y="405" width="22" height="14" /> </bpmndi:BPMNLabel> </bpmndi:BPMNShape> <bpmndi:BPMNShape id="Activity_1ffp7eo_di" bpmnElement="Activity_1oi4a1z"> <omgdc:Bounds x="390" y="340" width="100" height="80" /> </bpmndi:BPMNShape> </bpmndi:BPMNPlane> </bpmndi:BPMNDiagram> </definitions>`
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    newTemplateFn(type) {
      type === 1 && this.createNewDiagram(this.bpmnTemplate1);
      type === 2 && this.createNewDiagram(this.bpmnTemplate2);
    },
    newDiagram() {
      this.createNewDiagram(this.bpmnTemplate);
    },
    getXmlData() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (!err) {
          this.$alert(xml, '导出的xml数据')
        }
      });
    },
    downloadBpmn() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (!err) {
          // 获取文件名
          const name = `${this.getFilename(xml)}.bpmn`;
          // 将文件名以及数据交给下载方法
          this.download({ name: name, data: xml });
        }
      });
    },
    downloadSvg() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (!err) {
          // 获取文件名
          const name = `${this.getFilename(xml)}.svg`;

          // 从建模器画布中提取svg图形标签
          let context = "";
          const djsGroupAll = this.$refs.canvas.querySelectorAll(".djs-group");
          for (let item of djsGroupAll) {
            context += item.innerHTML;
          }
          // 获取svg的基本数据，长宽高
          const viewport = this.$refs.canvas
            .querySelector(".viewport")
            .getBBox();

          // 将标签和数据拼接成一个完整正常的svg图形
          const svg = `
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="${viewport.width}"
              height="${viewport.height}"
              viewBox="${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}"
              version="1.1"
              >
              ${context}
            </svg>
          `;
          // 将文件名以及数据交给下载方法
          this.download({ name: name, data: svg });
        }
      });
    },

    openBpmn(file) {
      const reader = new FileReader();
      // 读取File对象中的文本信息，编码格式为UTF-8
      reader.readAsText(file, "utf-8");
      reader.onload = () => {
        //读取完毕后将文本信息导入到Bpmn建模器
        this.createNewDiagram(reader.result);
      };
      return false;
    },

    getFilename(xml) {
      let start = xml.indexOf("process");
      let filename = xml.substr(start, xml.indexOf(">"));
      filename = filename.substr(filename.indexOf("id") + 4);
      filename = filename.substr(0, filename.indexOf('"'));
      return filename;
    },

    download({ name = "diagram.bpmn", data }) {
      // 这里就获取到了之前设置的隐藏链接
      const downloadLink = this.$refs.downloadLink;

      // 把数据转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data);

      if (data) {
        // 将数据给到链接
        downloadLink.href =
          "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
        // 设置文件名
        downloadLink.download = name;
        // 触发点击事件开始下载
        downloadLink.click();
      }
    },

    async init() {
      // 获取画布 element
      this.canvas = this.$refs.canvas;

      // 将汉化包装成一个模块
      const customTranslateModule = {
        translate: ["value", customTranslate]
      };

      // 创建Bpmn对象
      this.bpmnModeler = new BpmnModeler({
        // 设置bpmn的绘图容器为上门获取的画布 element
        container: this.canvas,

        // 加入工具栏支持
        propertiesPanel: {
          parent: "#js-properties-panel"
        },
        additionalModules: [
          // 工具栏模块
          propertiesProviderModule,
          propertiesPanelModule,
          // 汉化模块
          customTranslateModule
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      });

      await this.createNewDiagram(this.bpmnTemplate);
    },
    async createNewDiagram(bpmn) {
      // 将字符串转换成图显示出来;
      this.bpmnModeler.importXML(bpmn, err => {
        if (err) {
          this.$Message.error("打开模型出错,请确认该模型符合Bpmn2.0规范");
        }
      });
    }
  }
};
</script>

<style>
.bpmn-container {
  width: 100%;
  height: 100vh;
  display: flex;
}

.bpmn-canvas {
  width: calc(100% - 300px);
  height: 100vh;
}

.bpmn-js-properties-panel {
  width: 320px;
  height: inherit;
  overflow-y: auto;
}

.action1 {
  position: fixed;
  bottom: 100px;
  left: 100px;
  display: flex;
}
.action {
  position: fixed;
  bottom: 10px;
  left: 10px;
  display: flex;
}
.upload-demo {
  margin-right: 10px;
}
.el-message-box__message p{
  word-break: break-all;
}
</style>