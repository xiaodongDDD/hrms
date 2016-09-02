package com.hand.im.model;

/**
 * 请求实体
 * Created by cool on 2016/8/23.
 */
public class RequestModel {
    private String key;//参数是查询的名字，比如： 付伟
    private String page;//第几页
    private String pageSize;//每页大小

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getPage() {
        return page;
    }

    public void setPage(String page) {
        this.page = page;
    }

    public String getPageSize() {
        return pageSize;
    }

    public void setPageSize(String pageSize) {
        this.pageSize = pageSize;
    }
}
