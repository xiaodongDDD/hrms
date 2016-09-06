package com.hand.im.model;

import java.util.List;

/**
 * Created by cool on 2016/8/23.
 */
public class NameModel {

    /**
     * rows : [{"emp_name":"付朋","emp_code":"3704","position_name":"技术部华中2组经理","mobil":"18616921421","email":"peng.fu@hand-china.com","native_place":"江西九江","emp_status":"正式","gender":"男","avatar":"http://zhouzybk.img-cn-shanghai.aliyuncs.com/14691687120711469168712277.jpg"},{"emp_name":"付芳","emp_code":"4633","position_name":"应用服务顾问","mobil":"18621729799","email":"fang.fu@hand-china.com","native_place":"","emp_status":"正式","gender":"女","avatar":"http://zhouzybk.img-cn-shanghai.aliyuncs.com/14691718952731469171895499.jpg"},{"emp_name":"付冬会","emp_code":"5213","position_name":"顾问","mobil":"18616777683","email":"donghui.fu@hand-china.com","native_place":"云南","emp_status":"正式","gender":"女","avatar":"http://zhouzybk.img-cn-shanghai.aliyuncs.com/14691684096221469168409753.jpg"},{"emp_name":"付小狮","emp_code":"5320","position_name":"顾问","mobil":"15907111478","email":"xiaoshi.fu@hand-china.com","native_place":"武汉","emp_status":"正式","gender":"男","avatar":"http://zhouzybk.img-cn-shanghai.aliyuncs.com/14691675844601469167584537.jpg"},{"emp_name":"王付林","emp_code":"7320","position_name":"1组组长","mobil":"18511988623","email":"fulin.wang@hand-china.com","native_place":"山东","emp_status":"正式","gender":"男","avatar":"http://zhouzybk.img-cn-shanghai.aliyuncs.com/14691709874321469170988875.jpg"},{"emp_name":"付蕾","emp_code":"9175","position_name":"行业客户经理","mobil":"18621827851","email":"lei.fu01@hand-china.com","native_place":"","emp_status":"正式","gender":"女","avatar":"http://zhouzybk.img-cn-shanghai.aliyuncs.com/14691694371931469169437428.jpg"},{"emp_name":"付伟","emp_code":"9325","position_name":"软件工程师","mobil":"18720996851","email":"wei.fu01@hand-china.com","native_place":"江西","emp_status":"正式","gender":"男","avatar":"http://zhouzybk.img-cn-shanghai.aliyuncs.com/14691908605251469190860602.jpg"},{"emp_name":"付雅琼","emp_code":"9555","position_name":"程序员","mobil":"18862968058","email":"yaqiong.fu@hand-china.com","native_place":"江苏","emp_status":"试用","gender":"女","avatar":"http://zhouzybk.img-cn-shanghai.aliyuncs.com/14714224576381471422457724.jpg"},{"emp_name":"付哲","emp_code":"9611","position_name":"技术顾问","mobil":"18702980210","email":"zhe.fu@hand-china.com","native_place":"陕西","emp_status":"正式","gender":"男","avatar":"http://zhouzybk.img-cn-shanghai.aliyuncs.com/14691905399441469190540062.jpg"},{"emp_name":"付景彬","emp_code":"9712","position_name":"供应链1组顾问","mobil":"18240217666","email":"jingbin.fu@hand-china.com","native_place":"辽宁","emp_status":"试用","gender":"男","avatar":"http://zhouzybk.img-cn-shanghai.aliyuncs.com/14695216595541469521659718.jpg"}]
     * success : true
     * total : 10
     */

    private boolean success;
    private int total;
    /**
     * emp_name : 付朋
     * emp_code : 3704
     * position_name : 技术部华中2组经理
     * mobil : 18616921421
     * email : peng.fu@hand-china.com
     * native_place : 江西九江
     * emp_status : 正式
     * gender : 男
     * avatar : http://zhouzybk.img-cn-shanghai.aliyuncs.com/14691687120711469168712277.jpg
     */

    private List<RowsEntity> rows;

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public void setRows(List<RowsEntity> rows) {
        this.rows = rows;
    }

    public boolean isSuccess() {
        return success;
    }

    public int getTotal() {
        return total;
    }

    public List<RowsEntity> getRows() {
        return rows;
    }

    public static class RowsEntity {
        private String emp_name;
        private String emp_code;
        private String position_name;
        private String mobil;
        private String email;
        private String native_place;
        private String emp_status;
        private String gender;
        private String avatar;

        public void setEmp_name(String emp_name) {
            this.emp_name = emp_name;
        }

        public void setEmp_code(String emp_code) {
            this.emp_code = emp_code;
        }

        public void setPosition_name(String position_name) {
            this.position_name = position_name;
        }

        public void setMobil(String mobil) {
            this.mobil = mobil;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public void setNative_place(String native_place) {
            this.native_place = native_place;
        }

        public void setEmp_status(String emp_status) {
            this.emp_status = emp_status;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }

        public String getEmp_name() {
            return emp_name;
        }

        public String getEmp_code() {
            return emp_code;
        }

        public String getPosition_name() {
            return position_name;
        }

        public String getMobil() {
            return mobil;
        }

        public String getEmail() {
            return email;
        }

        public String getNative_place() {
            return native_place;
        }

        public String getEmp_status() {
            return emp_status;
        }

        public String getGender() {
            return gender;
        }

        public String getAvatar() {
            return avatar;
        }
    }
}
