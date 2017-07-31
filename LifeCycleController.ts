/**
 * Created by Administrator on 2017/6/1.
 */
module g_base{
    class LifeCycleController extends egret.HashObject {

        constructor(private stage: egret.Stage) {
            super();
            this.registerListeners();
        }
        private getPage() {
            var hidden, state, visibilityChange;
            if (typeof document["hidden"] !== "undefined") {
                hidden = "hidden";
                visibilityChange = "visibilitychange";
                state = "visibilityState";
            } else if (typeof document["mozHidden"] !== "undefined") {
                hidden = "mozHidden";
                visibilityChange = "mozvisibilitychange";
                state = "mozVisibilityState";
            } else if (typeof document["msHidden"] !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
                state = "msVisibilityState";
            } else if (typeof document["webkitHidden"] !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
                state = "webkitVisibilityState";
            }
            return {
                'hidden': hidden,
                'visibilityChange': visibilityChange,
                'state': state
            };
        }

        private registerListeners() {
            console.log("浏览器监听器注册事件");
            var Page= this.getPage();
            let eventHandler = (e) => {
                var now=new Date();
                var hours=now.getHours();
                var minutes=now.getMinutes();
                var seconds=now.getSeconds();

                if (document[Page['state']] == 'hidden') {
                    console.log("h5切换到后台" + hours + ":" + minutes + ":" + seconds);
                    alert("h5切换到后台");
                    g_base.getInstanceForGlobal().isBackstage = true;
                    mo.emitter.emit("Toground");
                    ////切出app
                    //g_base.getPomelo.notify(g_base.NET_ROUTE.REQUEAT_OUT_APP, {});
                } else
                {
                    alert("h5获得焦点");
                    console.log("h5获得焦点" + hours + ":" + minutes + ":" + seconds);
                    if (g_base.getInstanceForGlobal().RequestSynchData && g_base.getInstanceForGlobal().isBackstage) {
                        g_base.getPomelo.request(g_base.NET_ROUTE.REQUEST_SYNCHRO_ROOMDATA, {}, function(msg){
                            if (msg.code == 200) {
                                mo.emitter.emit("ReturnForeground", {msg:msg});
                                ////切回app
                                //g_base.getPomelo.notify(g_base.NET_ROUTE.REQUEAT_IN_APP, {});
                            }
                        });
                    }
                }
            }
            // 切换到后台触发
            //window.addEventListener("visibilitychange", eventHandler);
            // 获得焦点触发
            //window.addEventListener("focus", eventHandler);
            // 失去焦点触发
            //window.addEventListener("blur", eventHandler);

            document.addEventListener(Page['visibilityChange'], eventHandler, false);
        }


    }

    egret['web']['WebHideHandler'] = LifeCycleController;
}