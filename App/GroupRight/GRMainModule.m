//
//  GRMainModule.m
//  GroupRight
//
//  Created by Scott on 4/21/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "GRMainModule.h"

GRMainModule *GRMAIN;

@implementation GRMainModule

@synthesize user,ac,events,tasks,updates,messages,groups;

/* constructor */
+ (GRMainModule *) grMain
{
    if(!GRMAIN){
        GRMAIN = [[GRMainModule alloc] init];
    }
    return GRMAIN;
}

/* loading / parsing data */
- (void) addUserData: (NSDictionary *) raw
{
    // Clear the data.
    [groups removeAllObjects];
    [events removeAllObjects];
    [tasks removeAllObjects];
    [updates removeAllObjects];
    //[messages removeAllObjects];
    
    groups = (NSMutableArray *) [raw objectForKey:@"groups"];
    events = (NSMutableArray *) [raw objectForKey:@"events"];
    tasks = (NSMutableArray *) [raw objectForKey:@"tasks"];
    updates = (NSMutableArray *) [raw objectForKey:@"updates"];
    //messages = (NSMutableArray *) [raw objectForKey:@"messages"];
    
    return;
}

@end
