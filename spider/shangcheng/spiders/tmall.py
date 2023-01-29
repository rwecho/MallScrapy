import scrapy
from scrapy import Request, Spider
from shangcheng.items import ShangchengItem


class TmallSpider(scrapy.Spider):
    name = 'tmall'
    allowed_domains = ['s.taobao.com']
    start_urls = ['https://s.taobao.com/search?q=手机']
    mall_type = "tmall"

    def start_requests(self):
        for url in self.start_urls:
            yield Request(url=url, callback=self.parse, meta={ }, dont_filter=True)

    def parse(self, response):
        products = response.xpath(
            './/div[@class="grid g-clearfix"]//div[contains(@class, "item J_MouserOnverReq") and not(contains(@class, "item-ad"))]')
        for product in products:
            item = ShangchengItem()
            item['url'] = ''.join(product.xpath(
                './/div[@class="pic"]/a/@href').extract()).strip()
            # 图片的获取不稳定, 因为它是可见后才有具体的地址
            item['image'] = ''.join(product.xpath(
                './/div[@class="pic"]/a/img/@src').extract()).strip()
            item['name'] = ''.join(product.xpath(
                './/div[contains(@class, "ctx-box")]//div[contains(@class,"title")]/descendant::*/text()').extract()).strip()
            item['price'] = ''.join(product.xpath(
                './/div[contains(@class, "ctx-box")]//div[@class="deal-cnt"]/text()').extract()).strip()
            item['store'] = ''.join(product.xpath(
                './/div[contains(@class, "ctx-box")]//div[contains(@class,"shop")]/a/span/text()').extract()).strip()
            item['evaluate_num'] = \
                ''.join(product.xpath('.//div[contains(@class, "ctx-box")]//div[contains(@class,"price")]/span/text()')
                        .extract()).strip() +\
                ''.join(product.xpath('.//div[contains(@class, "ctx-box")]//div[contains(@class, "price")]/strong/text()')
                        .extract()).strip()
            yield item
