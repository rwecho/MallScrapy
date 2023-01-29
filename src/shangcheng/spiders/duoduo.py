import scrapy
from scrapy import Request, Spider
from shangcheng.items import ShangchengItem


class DuoduoSpider(scrapy.Spider):
    name = 'duoduo'
    allowed_domains = ['mobile.yangkeduo.com']
    start_urls = ['https://mobile.yangkeduo.com/search_result.html?search_key=手机']
    mall_type = "duoduo"


    def start_requests(self):
        for url in self.start_urls:
            yield Request(url=url, callback=self.parse, meta={}, dont_filter=True)

    def parse(self, response):
        products = response.xpath('.//div[@class="_3glhOBhU"]')
        for product in products:
            item = ShangchengItem()

            path = product.xpath(
                './/div/div/div/div/div[position()>0]')

            item['url'] = ''.join(product.xpath(
                './/div/div/div/div/div[position()>0]').extract()).strip()
            # 图片的获取不稳定, 因为它是可见后才有具体的地址
            item['image'] = ''.join(product.xpath(
                './/div/div/div/div/img/@src').extract()).strip()
            item['name'] = ''.join(product.xpath(
                './/div[@class="p-name p-name-type-2"]/a/em/text()').extract()).strip()
            item['price'] = ''.join(product.xpath(
                './/div[@class="p-price"]/strong/*/text()').extract()).strip()
            item['store'] = ''.join(product.xpath(
                './/div[@class="p-shop"]/span/a/text()').extract()).strip()
            item['evaluate_num'] = ''.join(product.xpath('.//div[@class="p-commit"]/strong/a/text()').extract(
            )).strip()+''.join(product.xpath('.//div[@class="p-commit"]/strong/text()').extract()).strip()
            yield item