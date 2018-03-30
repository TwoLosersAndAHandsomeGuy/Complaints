/* 中文UTF-8 */

/*
 函数名称：UserSelectWindow
 创建时间：2018-03-30
 实现功能：选择框
 */

var UserSelectWindow = {
    _openPageDivId: null,//弹出窗口的modal的id
    _leftTableId: "",
    _rightTableId: "",
    _isRadio: false,		//是否单选
    _leftueryParams : {},
    _openPage_callback: function (val) { //保存回调函数

    },
    _open: function () {
        var _this = this;

        $("#" + _this._openPageDivId).modal('show');
        this._init();
        $("#" + _this._openPageDivId).on('shown.bs.modal', function () {
            $("#" + _this._leftTableId).bootstrapTable("resetView");
            $("#" + _this._rightTableId).bootstrapTable("resetView");
        });
        if (this._isRadio) {
            $("#_btn_user_win_select_all_").hide();
            $("#_btn_user_win_remove_all_").hide();
        }
    },
    _close: function () {
        $("#" + this._openPageDivId).modal('hide');
    },

    _onLeftLoadSuccess: function () {
        var _this = this;
        var $leftTable = $('#' + _this._leftTableId).bootstrapTable();
        var $rightTable = $('#' + _this._rightTableId).bootstrapTable();
        var leftData = $leftTable.bootstrapTable('getData');
        var rightData = $rightTable.bootstrapTable('getData');
        var ids=[];
        if(leftData.length > 0 && rightData.length > 0){
            for(var i=0; i< leftData.length; i++){
                for(var j=0; j< rightData.length; j++){
                    if(leftData[i].id == rightData[j].id){
                        ids.push(leftData[i].id)
                        continue;
                    }
                }

            }

            $leftTable.bootstrapTable('remove', {
                field: 'id',
                values: ids
            });
        }
    },

    _leftTableInit: function () {
        var _this = this;
        var leftTable = new Object();
        leftTable.Init = function () {
            $('#' + _this._leftTableId).bootstrapTable({
                url: '../../demo/data/userTestData.json',         //请求后台的URL（*）
                method: 'get',                      //请求方式（*）
                striped: true,                      //是否显示行间隔色
                pagination: true,                   //是否显示分页（*）
                sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
                clickToSelect: true,                //是否启用点击选中行
                height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                queryParams : _this._leftueryParams,
                columns: [{
                    checkbox: true
                }, {
                    field: 'id',
                    visible: false
                },  {
                    field: 'userCode',
                    title: '人员工号'
                }, {
                    field: 'userName',
                    title: '人员名称'
                }, {
                    field: 'deptName',
                    title: '部门名称'
                }]
            });
        }
        return leftTable;
    },

    _rightTableInit: function () {
        var _this = this;
        var rightTable = new Object();
        rightTable.Init = function () {
            $('#' + _this._rightTableId).bootstrapTable({
                url: '',         //请求后台的URL（*）
                method: 'get',                      //请求方式（*）
                striped: true,                      //是否显示行间隔色
                pagination: true,                   //是否显示分页（*）
                sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
                clickToSelect: true,                //是否启用点击选中行
                height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                onLoadSuccess:function(data){
                    _this._onLeftLoadSuccess();
                },
                columns: [{
                    checkbox: true,
                    formatter: _this._stateFormatter
                }, {
                    field: 'id',
                    visible: false
                }, {
                    field: 'userCode',
                    title: '人员工号'
                }, {
                    field: 'userName',
                    title: '人员名称'
                }, {
                    field: 'deptName',
                    title: '部门名称'
                }]
            });
        }
        return rightTable;
    },

    _stateFormatter: function (value, row, index) {
        if (row[0] == false)
            return {
                disabled: true,//设置是否可用
                checked: false//设置选中
            };
        return value;
    },

    _init: function (html, data) {
        var leftTable = this._leftTableInit();
        leftTable.Init();

        var rightTable = this._rightTableInit();
        rightTable.Init();
    },


    //divID,标题，回调函数,radio是否单选,查询参数
    open: function (title, callback, isRadio,leftparams) {
        if(leftparams){
            this._leftueryParams = leftparams;
        }
        if ($("#userSelectDivId").length == 0) {
            $(document.body).append('<div id="userSelectDivId"></div>');
        }

        //删除多余组件
        if ($("#userSelectDivId div").length != 0) {
            $("#userSelectDivId" + " div").remove();
        }
        if (title == null) {
            title = "选择";
        }
        var html = "";
        var random = Math.round(Math.random() * 1000);
        var _id = "_select_window_" + random;
        this._leftTableId = "_leftTableId_" + random;
        this._rightTableId = "_rightTableId_" + random;
        if (isRadio) {
            this._isRadio = true;
        }

        html += '<div class="modal fade" id="' + _id + '" tabindex="-1" role="dialog" aria-labelledby="' + _id + 'Label" data-backdrop="static">';
        html += '    <div class="modal-dialog modal-lg" role="document">';
        html += '      <div class="modal-content">';
        html += '        <div class="modal-header">';
        html += '          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        html += '          <h4 class="modal-title" id="' + _id + 'Label">' + title + '</h4>';
        html += '        </div>';
        html += '        <div class="modal-body">';
        html += '            <div class="col-xs-5" style="padding-bottom: 15px;">';
        html += '                <div class="col-xs-8">';
        html += '                    <input type="text" class="form-control" id="userSelectName" placeholder="姓名/单位名">';
        html += '                </div>';
        html += '                <button type="button" class="btn btn-info" onclick="UserSelectWindow._selectSearch()">';
        html += '                    <span class="glyphicon glyphicon-search"></span>查询';
        html += '                </button>';
        html += '            </div>';
        html += '            <div class="col-xs-7">';
        html += '                <div class="alert alert-danger" id="_user_select_err_alert" style="padding: 5px;margin-bottom: 0px;display:none;">错误！只能单选！</div>';
        html += '            </div>';
        html += '			<table class="table table-bordered dchannel-table">';
        html += '				<tbody>';
        html += '				<tr class="item-default">';
        html += '					<td align="top" style="width: 50%;">';
        html += '						<table id="' + this._leftTableId + '"></table>';
        html += '					</td>';
        html += '					<td style="width: 50px;" valign="middle">';
        html += '						<button type="button" class="btn btn-default btn-small" id="_btn_user_win_select_all_" onclick="UserSelectWindow._select_all()">';
        html += '							<span class="glyphicon glyphicon-forward"></span></button>';
        html += '						<button type="button" class="btn btn-default btn-small" id="_btn_user_win_select_" onclick="UserSelectWindow._select()">';
        html += '							<span class="glyphicon glyphicon-chevron-right"></span></button>';
        html += '						<button type="button" class="btn btn-default btn-small" id="_btn_user_win_remove_selected_" onclick="UserSelectWindow._remove()">';
        html += '							<span class="glyphicon glyphicon-chevron-left"></span></button>';
        html += '						<button type="button" class="btn btn-default btn-small" id="_btn_user_win_remove_all_" onclick="UserSelectWindow._remove_all()">';
        html += '							<span class="glyphicon glyphicon-backward"></span></button>';
        html += '					</td>';
        html += '					<td align="top" style="width: 50%;">';
        html += '						<table id="' + this._rightTableId + '"></table>';
        html += '					</td>';
        html += '				</tr>';
        html += '			</tbody>';
        html += '		</table>';
        html += '        </div>';
        html += '        <div class="modal-footer">';
        html += '          <button type="button" class="btn btn-default" onclick="UserSelectWindow._close()">';
        html += '          	<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>关闭</button>';
        html += '          <button type="button" class="btn btn-primary" onclick="UserSelectWindow._submit()">';
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
    _select_all: function () {
        var _this = this;
        var $leftTable = $('#' + _this._leftTableId).bootstrapTable();
        var $rightTable = $('#' + _this._rightTableId).bootstrapTable();
        var selectContent = $leftTable.bootstrapTable('getData');

        if (this._isRadio && selectContent.length > 1) {
            $("#_user_select_err_alert").show();
            return false;
        }

        $rightTable.bootstrapTable("append", selectContent);
        $leftTable.bootstrapTable('removeAll');
    },
    _select: function () {
        var _this = this;
        var $leftTable = $('#' + _this._leftTableId).bootstrapTable();
        var $rightTable = $('#' + _this._rightTableId).bootstrapTable();
        var selectContent = $leftTable.bootstrapTable('getSelections');
        if (this._isRadio) {
            var rightData = $rightTable.bootstrapTable('getData');
            if (selectContent.length > 1 || rightData.length > 0) {
                $("#_user_select_err_alert").show();
                return false;
            }
        }

        $rightTable.bootstrapTable("append", selectContent);
        var ids = $.map(selectContent, function (row) {
            return row.id;
        });

        $leftTable.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
    },
    _remove_all: function () {
        var _this = this;
        var $leftTable = $('#' + _this._leftTableId).bootstrapTable();
        var $rightTable = $('#' + _this._rightTableId).bootstrapTable();

        var selectContent = $rightTable.bootstrapTable('getData');
        $leftTable.bootstrapTable("append", selectContent);
        $rightTable.bootstrapTable('removeAll');
        $leftTable.bootstrapTable("uncheckAll");
    },
    _remove: function () {
        var _this = this;
        var $leftTable = $('#' + _this._leftTableId).bootstrapTable();
        var $rightTable = $('#' + _this._rightTableId).bootstrapTable();

        var selectContent = $rightTable.bootstrapTable('getSelections');
        $leftTable.bootstrapTable("append", selectContent);
        var ids = $.map(selectContent, function (row) {
            row[0] = false;
            return row.id;
        });

        $rightTable.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
        $leftTable.bootstrapTable("uncheckBy", {
            field: 'id',
            values: ids
        });

    },
    _submit: function () {
        var $rightTable = $('#' + this._rightTableId).bootstrapTable();
        var rightData = $rightTable.bootstrapTable('getData');
        this._close();
        this._openPage_callback(rightData);
    },
    _selectSearch : function(){
        this._leftueryParams.nameStr = $('#userSelectName').val();
        var $leftTable = $('#' + this._leftTableId).bootstrapTable();
        $leftTable.bootstrapTable("refresh");
    }
}