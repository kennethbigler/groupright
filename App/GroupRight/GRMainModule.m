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

@synthesize user,ac,events,tasks,updates,messages,groups,groupsDict,contacts,fname,lname;

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
    
    groups = (NSMutableArray *) [raw objectForKey:@"memberships"];
    
    //messages = (NSMutableArray *) [raw objectForKey:@"messages"];
    
    fname = (NSString *) [raw objectForKey:@"first_name"];
    lname = (NSString *) [raw objectForKey:@"last_name"];
    
    groupsDict = [[NSMutableDictionary alloc] init];
    contacts = [[NSMutableDictionary alloc] init];
    for(int i = 0; i < [groups count]; i++)
    {
        [groupsDict setObject:groups[i] forKey:[groups[i] objectForKey:@"group_id"]];
        NSMutableArray *members = (NSMutableArray *)[groups[i] objectForKey:@"members"];
        for (int j = 0; j < [members count]; j++)
        {
            [contacts setObject:members[j] forKey:[members[j] objectForKey:@"email"]];
        }
    }
    
    
    NSArray *tempEvents = (NSArray *) [raw objectForKey:@"events"];
    events = [[NSMutableArray alloc] init];
    for( int i = 0; i < [tempEvents count]; i++)
    {
        if([tempEvents[i] objectForKey:@"start_time"] != [NSNull null])
        {
            [events addObject:tempEvents[i]];
        }
    }
    
    
    tasks = (NSMutableArray *) [raw objectForKey:@"tasks"];
    updates = (NSMutableArray *) [raw objectForKey:@"updates"];
    
    
    
    
    return;
}

- (NSString*) getFullNameForEmail:(NSString*) email
{
    NSDictionary *person = (NSDictionary *)[contacts objectForKey:email];
    NSString *name = [NSString stringWithFormat:@"%@ %@", [person objectForKey:@"first_name"],[person objectForKey:@"last_name"]];
    return name;
}
- (UIColor*) getColorForGroupWithId:(NSString*) guid AtAlpha: (float) alpha{
    
    NSString *hexColor = (NSString *)[[groupsDict objectForKey:guid] objectForKey:@"group_color"];
    NSString *rColor = [hexColor substringWithRange:NSMakeRange(1, 2)];
    NSString *gColor = [hexColor substringWithRange:NSMakeRange(3, 2)];
    NSString *bColor = [hexColor substringWithRange:NSMakeRange(5, 2)];
    
    unsigned ri,gi,bi;
    
    NSScanner *scanner = [NSScanner scannerWithString:rColor];
    [scanner scanHexInt:&ri];
    scanner = [scanner initWithString:gColor];
    [scanner scanHexInt:&gi];
    scanner = [scanner initWithString:bColor];
    [scanner scanHexInt:&bi];
    
     float rf,gf,bf;
     rf = ((float) ri)/255.0;
     gf = ((float) gi)/255.0;
     bf = ((float) bi)/255.0;

    
    UIColor *myColor = [UIColor colorWithRed:rf green:gf blue:bf alpha:alpha];
    return myColor;
}

- (UIColor *) getColorForGroupWithId:(NSString *)guid{
    return [self getColorForGroupWithId:guid AtAlpha:0.5f];
}

@end
