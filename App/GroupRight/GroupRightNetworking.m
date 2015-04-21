//
//  GroupRightNetworking.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/20/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "GroupRightNetworking.h"

@implementation GroupRightNetworking
+(NSData *)postDataToGroupServe:(NSString*)jsonString
{
    NSString *urlString = @"https://www.groupright.net/dev/groupserve.php";
    NSData* responseData = nil;
    NSURL *url=[NSURL URLWithString:[urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
    responseData = [NSMutableData data] ;
    NSMutableURLRequest *request=[NSMutableURLRequest requestWithURL:url];
    NSString *bodydata=[NSString stringWithFormat:@"data=%@",jsonString];
    bodydata=[NSString stringWithFormat:@"function=login&email=zwilson7@gmail.com&password=test1"];
    //Valid Cookie f18YMPFEP0otkZpRVsQV7B2FPLTaFG3L
    bodydata=[NSString stringWithFormat:@"function=get_user_info&email=zwilson7@gmail.com&ac=f18YMPFEP0otkZpRVsQV7B2FPLTaFG3L"];
    NSLog(bodydata);
    [request setHTTPMethod:@"POST"];
    NSData *req=[NSData dataWithBytes:[bodydata UTF8String] length:[bodydata length]];
    [request setHTTPBody:req];
    NSURLResponse* response;
    NSError* error = nil;
    responseData = [NSURLConnection sendSynchronousRequest:request     returningResponse:&response error:&error];
    NSString *responseString = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
    
    //NSLog(@"the final output is:%@",responseString);
    
    NSError *jsonError;
    NSData *objectData = [responseString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:objectData
                                                         options:NSJSONReadingMutableContainers
                                                           error:&jsonError];
    /*for (id key in json) {
        if([key isEqual:@"updates"]){
            for(int i=0; i<[[json objectForKey:key] count];i++){
                NSLog(@"key: %@, value: %@", key, [json objectForKey:key]);
            }
        }
    }*/
    NSLog(@"Login Successful");
    return responseData;
}
+(NSString*)loginToGroupServeWithUsername:(NSString*)username andPassword:(NSString*)password{
    NSString *urlString = @"https://www.groupright.net/dev/groupserve.php";
    NSData* responseData = nil;
    NSURL *url=[NSURL URLWithString:[urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
    responseData = [NSMutableData data] ;
    NSMutableURLRequest *request=[NSMutableURLRequest requestWithURL:url];
    NSString *bodydata=[NSString stringWithFormat:@"function=login&email=%@&password=%@",username,password];
    [request setHTTPMethod:@"POST"];
    NSData *req=[NSData dataWithBytes:[bodydata UTF8String] length:[bodydata length]];
    [request setHTTPBody:req];
    NSURLResponse* response;
    NSError* error = nil;
    responseData = [NSURLConnection sendSynchronousRequest:request     returningResponse:&response error:&error];
    NSString *cookie = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
    return cookie;
    
}

@end
