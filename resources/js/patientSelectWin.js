/* 中文UTF-8 */

/*
 函数名称：PatientSelectWindow
 创建时间：2018-03-30
 实现功能：患者选择框
 */

var PatientSelectWindow = {
    _openPageDivId: null,//弹出窗口的modal的id
    _leftTableId: "",
    _isRadio: false,		//是否单选
    _patientDomain: 01,
    _openPage_callback: function (val) { //保存回调函数

    },
    _open: function () {
        var _this = this;

        $("#" + _this._openPageDivId).modal('show');
        this._init();
        $("#" + _this._openPageDivId).on('shown.bs.modal', function () {
            $("#" + _this._leftTableId).bootstrapTable("resetView");
        });
    },
    _close: function () {
        $("#" + this._openPageDivId).modal('hide');
    },

    _onLeftLoadSuccess: function () {

    },

    _leftTableInit: function () {
        var _this = this;
        var leftTable = new Object();
        leftTable.Init = function () {
            $('#' + _this._leftTableId).bootstrapTable({
                url: 'http://10.3.16.24:8011/dsg/rest/queryPatientInfo',         //请求后台的URL（*）
                method: 'get',                      //请求方式（*）
                striped: true,                      //是否显示行间隔色
                pagination: true,                   //是否显示分页（*）
                sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
                clickToSelect: true,                //是否启用点击选中行
                height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                queryParams: _this._leftueryParams,
                onLoadSuccess: function (data) {
                    var a = data;
                },
                onLoadError : function(data){
                    var b = data;
                },
                columns: [{
                    checkbox: true
                }, {
                    field: 'patientId',
                    title: '病人ID',
                    visible: false
                }, {
                    field: 'userCode',
                    title: '人员工号'
                }, {
                    field: 'name',
                    title: '姓名'
                }, {
                    field: 'gender',
                    title: '性别'
                }, {
                    field: 'birthdate',
                    title: '出生日期'
                }, {
                    field: 'marriageStatus',
                    title: '婚姻状态'
                }, {
                    field: 'nation',
                    title: '民族'
                }, {
                    field: 'nationality',
                    title: '国籍'
                }, {
                    field: 'telephone',
                    title: '联系电话'
                }, {
                    field: 'mobile',
                    title: '手机'
                }, {
                    field: 'outpatientNo',
                    title: '门诊号'
                }, {
                    field: 'outpatientNo',
                    title: '门诊号'
                }, {
                    field: 'inpatientNo',
                    title: '住院号'
                }, {
                    field: 'credentialType',
                    title: '证件类别'
                }, {
                    field: 'credentialNo',
                    title: '证件号码'
                }, {
                    field: 'patientSn',
                    title: '患者内部序列号'
                }, {
                    field: 'education',
                    title: '学历'
                }, {
                    field: 'occupation',
                    title: '职业'
                }
                ]
            });
        }
        return leftTable;
    },

    _leftueryParams: function (params) {
        var limit = params.limit;   //页面大小 10
        var offset = params.offset;  //页码
        if(0 == offset){
            offset = 1;
        }
        var _this = this;
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            IndexFrom: (offset * limit - 9),        //起始行数
            IndexTo: (offset * limit),              //结束行数
            patientName: $("#patientSelectName").val(),
            patientDomain: _this._patientDomain,
            userId: 'OA',
            password: 'ffb4513f2a3a46ad17d19ff6b56f9a2d'
        };
        return temp;
    },
    _init: function (html, data) {
        var leftTable = this._leftTableInit();
        leftTable.Init();

    },


    //域ID，传编码（01：门诊，02：住院）,回调函数,radio是否单选,查询参数
    open: function (patientDomain, callback, leftparams) {
        if ($("#userSelectDivId").length == 0) {
            $(document.body).append('<div id="userSelectDivId"></div>');
        }

        //删除多余组件
        if ($("#userSelectDivId div").length != 0) {
            $("#userSelectDivId" + " div").remove();
        }
        if ("01" == patientDomain) {
            this._patientDomain = '01';
        } else {
            this._patientDomain = '02';
        }
        var html = "";
        var random = Math.round(Math.random() * 1000);
        var _id = "_patient_select_window_" + random;
        this._leftTableId = "_leftTableId_" + random;

        html += '<div class="modal fade selectModal" id="' + _id + '" tabindex="-1" role="dialog" aria-labelledby="' + _id + 'Label" data-backdrop="static">';
        html += '    <div class="modal-dialog modal-lg" role="document" style="width: 1000px;">';
        html += '      <div class="modal-content" style="width: 1000px;">';
        html += '        <div class="modal-header">';
        html += '          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        html += '          <h4 class="modal-title" id="' + _id + 'Label">患者选择</h4>';
        html += '        </div>';
        html += '        <div class="modal-body">';
        html += '            <div class="col-xs-5" style="padding-bottom: 15px;">';
        html += '                <div class="col-xs-8">';
        html += '                    <input type="text" class="form-control" id="patientSelectName" placeholder="姓名/单位名">';
        html += '                </div>';
        html += '                <button type="button" class="btn btn-info" onclick="PatientSelectWindow._selectSearch()">';
        html += '                    <span class="glyphicon glyphicon-search"></span>查询';
        html += '                </button>';
        html += '            </div>';
        html += '            <div class="col-xs-7">';
        html += '                <div class="alert alert-danger" id="_user_select_err_alert" style="padding: 5px;margin-bottom: 0px;display:none;">错误！只能单选！</div>';
        html += '            </div>';
        html += '			<table id="' + this._leftTableId + '"></table>';
        html += '        </div>';
        html += '        <div class="modal-footer">';
        html += '          <button type="button" class="btn btn-default" onclick="PatientSelectWindow._close()">';
        html += '          	<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>关闭</button>';
        html += '          <button type="button" class="btn btn-primary" onclick="PatientSelectWindow._submit()">';
        html += '          	<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>确定</button>';
        html += '        </div>';
        html += '      </div>';
        html += '    </div>';
        html += '</div>';
        $('#userSelectDivId').append(html);
        this._openPageDivId = _id;
        if (callback) {
            this._openPage_callback = callback;
        }
        this._open();
    },

    _radioAlert: function () {
        var $leftTable = $('#' + this._leftTableId).bootstrapTable();
        var selectContent = $leftTable.bootstrapTable('getSelections');
        if (this._isRadio) {
            if (selectContent.length > 1) {
                $("#_user_select_err_alert").show();
                return false;
            } else {
                $("#_user_select_err_alert").hide();
                return true;
            }
        }
        return true;
    },


    _submit: function () {
        var $leftTable = $('#' + this._leftTableId).bootstrapTable();
        var selectContent = $leftTable.bootstrapTable('getSelections');
        this._close();
        this._openPage_callback(selectContent);
    },
    _selectSearch: function () {
        var $leftTable = $('#' + this._leftTableId).bootstrapTable();
        $leftTable.bootstrapTable("refresh");
    }
}