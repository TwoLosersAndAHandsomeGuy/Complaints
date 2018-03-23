/* 中文UTF-8 */

/*
函数名称：SelectWindow
创建时间：2018-03-14
实现功能：选择框
*/

var SelectWindow = {
	_openPageDivId:null,//弹出窗口的modal的id
	_all_select_id:"",
	_selected_select_id:"",
	_nameInputId:"",
    _idInputId :"",
	_openPage_callback: function(nameStr, idStr){ //保存回调函数

	}, 
	_open:function(){
		$("#"+this._openPageDivId).modal('show');
	},
	_close:function(){
		$("#"+this._openPageDivId).modal('hide');
	},
	_each:function(html,data){
		if(data != null){
			for(var i=0; i<data.length ;i++ ){
                html += '<option value="'+ data[i].id+'">'+data[i].name+'</option> ';
			}
		}
		return html;
	},
	//divID,标题，回调函数，要选择的数据，已选择的数据 ,名称插入ID, ID插入框Id
	open:function(divId, title, callback, allData, selDate ,nameInputId, idInputId){

		//删除多余组件
		if($("#" + divId + " div").length != 0){
			$("#" + divId + " div").remove();
		}
		if(title == null){
			title = "选择";
		}
		var html = "";
		var random = Math.round(Math.random() * 1000);
        this._nameInputId = nameInputId;
        this._idInputId = idInputId;
		var _id = "_select_window_" + random;
		this._all_select_id = "_all_select_" + random;
		this._selected_select_id = "_selected_obj_" + random;

		html += '<div class="modal fade" id="' + _id + '" tabindex="-1" role="dialog" aria-labelledby="'+ _id + 'Label" data-backdrop="static" style="top: 250px; left: 270px; overflow:scroll">';
		html += '    <div class="modal-dialog modal-lg" role="document">';
		html += '      <div class="modal-content">';
		html += '        <div class="modal-header">';
		html += '          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
		html += '          <h4 class="modal-title" id="' + _id + 'Label">'+ title +'</h4>';
		html += '        </div>';
		html += '        <div class="modal-body">';
		html += '			<table class="table table-bordered dchannel-table">';
		html += '				<tbody>';
		html += '				<tr class="item-default">';
		html += '					<td align="right" style="width: 50%;">';
		html += '						<select id="' + this._all_select_id + '" multiple="multiple" size="10" style="width:100%;"> ';
		html = this._each(html,allData);
		html += '						</select>';
		html += '					</td>';
		html += '					<td style="width: 50px;" valign="middle">';
		html += '						<button type="button" class="btn btn-default btn-small" id="_btn_select_all_" onclick="SelectWindow._select_all()">';
		html += '							<span class="glyphicon glyphicon-forward"></span></button>';
		html += '						<button type="button" class="btn btn-default btn-small" id="_btn_select_" onclick="SelectWindow._select()">';
		html += '							<span class="glyphicon glyphicon-chevron-right"></span></button>';
		html += '						<button type="button" class="btn btn-default btn-small" id="_btn_remove_selected_" onclick="SelectWindow._remove()">';
		html += '							<span class="glyphicon glyphicon-chevron-left"></span></button>';
		html += '						<button type="button" class="btn btn-default btn-small" id="_btn_remove_all_" onclick="SelectWindow._remove_all()">';
		html += '							<span class="glyphicon glyphicon-backward"></span></button>';
		html += '					</td>';
		html += '					<td align="right" style="width: 50%;">';
		html += '						<select id="'+ this._selected_select_id +'"  multiple="multiple" size="10" style="width:100%; height: 100%;">';
		html = this._each(html,selDate);
		html += '						</select>';
		html += '					</td>';
		html += '				</tr>';
		html += '			</tbody>';
		html += '		</table>';
		html += '        </div>';
		html += '        <div class="modal-footer">';
		html += '          <button type="button" class="btn btn-default" onclick="SelectWindow._close()">';
		html += '          	<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>关闭</button>';
		html += '          <button type="button" class="btn btn-primary" onclick="SelectWindow._select_submit()">';
		html += '          	<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>确定</button>';
		html += '        </div>';
		html += '      </div>';
		html += '    </div>';
		html += '</div>';
		$('#'+divId).append(html);
		this._openPageDivId = _id;
		if (callback) {	
			this._openPage_callback = callback;
		}
		this._open();
	},
	_select_all:function (){
            $("#"+ this._all_select_id +" option").appendTo("#" + this._selected_select_id);
	},
	_select : function (){
		if($("#" + this._all_select_id + " option").is(":selected")) {
			$("#"+ this._all_select_id +" option:selected").appendTo("#" + this._selected_select_id);
		}
	},
	_remove_all: function (){
		$("#" + this._selected_select_id + " option").appendTo("#" + this._all_select_id);
	},
	_remove: function (){
        if($("#" + this._selected_select_id + " option").is(":selected")) {
            $("#" + this._selected_select_id + " option:selected").appendTo("#" + this._all_select_id);
		}
	},
	_select_submit : function(){
		var idStr = ""
		var nameStr = ""
		var returnObj = [];
		$("#" + this._selected_select_id + " option").each(function(i){
			idStr += $(this).val() + ",";
			nameStr += $(this).text() + ",";
            returnObj.push($(this));
		})
		if(idStr.length != 0){
			idStr = idStr.substr(0, idStr.length - 1);
			nameStr = nameStr.substr(0, nameStr.length - 1);
		}
        this._close();
		this._openPage_callback(nameStr,idStr, this._nameInputId, this._idInputId);
	}
}