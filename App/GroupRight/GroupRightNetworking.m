//
//  GroupRightNetworking.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/20/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "GroupRightNetworking.h"
#import "GRMainModule.h"

@implementation GroupRightNetworking
+(void)getUserInfo
{
    // Get main module.
    GRMainModule *grmm = [GRMainModule grMain];
    
    // Set URL.
    NSString *urlString = @"https://www.groupright.net/dev/groupserve.php";
    NSURL *url=[NSURL URLWithString:[urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
    
    // Set Request Data
    NSMutableURLRequest *request=[NSMutableURLRequest requestWithURL:url];
    NSString *bodydata=[NSString stringWithFormat:@"function=get_user_info&email=%@&ac=%@",[grmm user],[grmm ac]];
    [request setHTTPMethod:@"POST"];
    NSData *req=[NSData dataWithBytes:[bodydata UTF8String] length:[bodydata length]];
    [request setHTTPBody:req];
    
    // Init response data.
    NSData* responseData = nil;
    responseData = [NSMutableData data] ;

    // Send request (and get response data).
    NSURLResponse* response;
    NSError* error = nil;
    responseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
    NSString *responseString = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
    
    // Parse string into JSON.
    NSError *jsonError;
    NSData *objectData = [responseString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:objectData
                                                         options:NSJSONReadingMutableContainers
                                                           error:&jsonError];
    // Pass JSON to grmm.
    [grmm addUserData:json];
    return;
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
