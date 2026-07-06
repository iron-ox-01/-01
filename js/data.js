/**
 * 博物馆数据
 * 字段说明：
 * - name: 博物馆名称
 * - position: [经度, 纬度] （从高德地图坐标拾取器获取）
 * - address: 具体地址
 * - openingHours: 开馆时间
 * - phone: 联系电话
 * - image: 图片URL（可用网络图片或本地图片）
 * - description: 简介（可选）
 */
const museums = [
    {
        name: "云锦博物院",
        position: [118.744814,32.03639],
        address: "江苏省南京市建邺区茶亭东街240号",
        openingHours: "09:30-17:00 国家法定节假日正常开放",
        phone: "010-65131892",
        image: "http://www.yjmuseum.com/images/ab01.jpg",
        description: "新金陵48景"
    },
    {
        name: "中国满绣博物馆",
        position: [129.606488,44.5276],
        address: "黑龙江省牡丹江市东安区江南五洲国际南门23-1号",
        openingHours: "以当日公示为准",
        phone: "15046395555",
        image:"https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/search_multi_media/9d278921f241433f8ddaea03efb848d6~tplv-a9rns2rl98-pc_smart_face_crop-v1:512:384.image?lk3s=8e244e95&rcl=202602192327523AE25658DFCDC76D2323&rrcfp=cee388b0&x-expires=2086874882&x-signature=HDt3Y%2B2IB7rVq1FeiNBlac0fHQU%3D",
        description: "集满绣的收藏、展示、传承、研发、体验于一体的专业场馆"
    },
    {
        name: "阿拉善博物馆",
        position: [105.725742,38.848275],
        address: "内蒙古自治区阿拉善盟阿拉善左旗巴彦浩特镇额鲁特东路",
        openingHours: ":周一全天关闭(法定节假日除外)，周二至周日:09:30-17:30(17:00停止入馆);2026年2月16日至18日闭馆",
        phone: "0483-8331184",
        image: "https://ts2.tc.mm.bing.net/th/id/ODL.def38ba89746ea0a8d01ccde65de6264?w=310&h=198&c=7&rs=1&bgcl=fffffe&r=0&o=6&dpr=1.5&pid=AlgoBlockDebug",
        description: "非遗展厅设有毡绣展区，并有传承人现场演示毡绣、皮雕等技艺"
    },
    {
        name: "辽河美术馆",
        position: [122.096656,41.132996],
        address: "盘锦市兴隆台区兴隆台街28号",
        openingHours: "周一至周日 09:00-17:00",
        phone: "0427-2833997",
        image: "https://ts3.tc.mm.bing.net/th/id/OIP-C.R4jgkFpGJtUS21LeQqiMqgHaFj?rs=1&pid=ImgDetMain&o=7&rm=3",
        description: "国家文化产业示范基地"
    },
    {
    "name": "中国国家博物馆",
    "position": [116.403905, 39.903781],
    "address": "北京市东城区东长安街16号（天安门广场东侧）",
    "openingHours": "周二至周日 09:00-17:00（16:00停止入馆），周一闭馆（法定节假日除外）",
    "phone": "010-65116400",
    "image": "https://tse2-mm.cn.bing.net/th/id/OIP-C.7RF45Bo328xfqAfko5zEAQHaEq?w=279&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    "description": "世界上单体建筑面积最大的博物馆，藏品数量140万余件，涵盖古代文物、近现当代文物、艺术品等多种门类"
    },
    {
        name: "东台市博物馆",
        position: [120.321215,32.864439],
        address: "江苏省盐城市东台市广场路10号",
        openingHours: "周二至周日上午8:30-12:00下午14:30-18:00",
        phone: "0515-85292285",
        image: "http://dtmuseum.cn/uploadfilexx/image/20200305160618571857.JPG",
        description: "国家二级馆，藏有《清明上河图》《姑苏繁华图》等巨幅发绣精品"
    }
];

// 注意：上面的图片URL是我写的示例，你需要替换为真实的图片地址
// 建议使用图床或者将图片下载到images文件夹，然后使用相对路径
// 例如：image: "images/gugong.jpg"
