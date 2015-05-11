//
//  EventsViewController.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "EventsViewController.h"
#import "LoginViewController.h"
#import "GRMainModule.h"
#import "EventsTableCell.h"

@interface EventsViewController ()

@end

@implementation EventsViewController

/*
 #pragma mark - Navigation
 
 // In a storyboard-based application, you will often want to do a little preparation before navigation
 - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
 // Get the new view controller using [segue destinationViewController].
 // Pass the selected object to the new view controller.
 }
 */
- (void)viewDidLoad {
    [super viewDidLoad];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(doYourStuff)
                                                 name:UIApplicationWillEnterForegroundNotification object:nil];
    // Do any additional setup after loading the view, typically from a nib.
}
-(void)doYourStuff{
    [_EventsTable reloadData];
}

-(void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}
- (void)viewDidAppear:(BOOL)animated
{
    GRMainModule *grmm = [GRMainModule grMain];
    
    
    if([grmm ac] == nil )
    {
        UIStoryboard *storyboard = self.storyboard;
        
        LoginViewController *lvc = [storyboard instantiateViewControllerWithIdentifier:@"loginVC"];
        [self presentViewController:lvc animated:NO completion:nil];
    }
    //LoginViewController *lvc = [storyboard instantiateViewControllerWithIdentifier:@"loginVC"];
    //[self presentViewController:lvc animated:NO completion:nil];
    self.displayEvents= [[NSMutableArray alloc]init];
    
    NSDate *currentDate = [NSDate date];
    NSCalendar* calendar = [NSCalendar currentCalendar];
    NSDateComponents* components = [calendar components:NSCalendarUnitYear|NSCalendarUnitMonth|NSCalendarUnitDay fromDate:currentDate]; // Get necessary date components
    
    NSInteger currentMonth=[components month]; //gives you month
    NSInteger currentDay=[components day]; //gives you day
    NSInteger currentYear=[components year]; // gives you year
    NSInteger day,month,year;
    for(int i=0; i<[grmm.events count]; i++){
        NSDictionary *event = [grmm.events objectAtIndex:i];
        
        NSString *startDateStr = [event objectForKey:@"start_time"];
        NSDateFormatter *df = [[NSDateFormatter alloc] init];
        [df setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"UTC"]];
        [df setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
        [df setTimeZone:[NSTimeZone systemTimeZone]];
        
        NSDate *st_date = [df dateFromString:startDateStr];
        
        
        
        [df setDateFormat:@"d"];
        day = [[df stringFromDate:st_date] intValue];
        NSString * temp=[df stringFromDate:st_date];
        
        [df setDateFormat:@"M"];
        month = [[df stringFromDate:st_date] intValue];
        
        [df setDateFormat:@"y"];
        year = [[df stringFromDate:st_date] intValue];
  
        if(year==currentYear){
            if(month>currentMonth){
                //Future Month
                [self.displayEvents addObject:event];
                //NSLog(@"added event");
            }
            else if(month<currentMonth){
                //Past Month (Don't add)
            }
            else{
                //This month
                if(day>=currentDay){
                    [self.displayEvents addObject:event];
                     //NSLog(@"added event");
                }
                
            }
            
        }
        else if(year>currentYear){
            [self.displayEvents addObject:event];
             //NSLog(@"added event");
        }
    }
    [_EventsTable reloadData];
    //NSLog(@"Hello1");
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


// =============================================================================================
//  Updates Table
// =============================================================================================

- (NSInteger) numberOfSectionsInTableView:(UITableView *)tableView{
    return 1;
}

- (NSInteger) tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    //GRMainModule *grmm = [GRMainModule grMain];
    //NSLog(@"Hello");
    return [_displayEvents count];
}

- (UITableViewCell *) tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    GRMainModule *grmm = [GRMainModule grMain];
    static NSString *cellID = @"EventsCell";
    
    //Get a new or recycled cell
    EventsTableCell *cell = (EventsTableCell *)[tableView dequeueReusableCellWithIdentifier:cellID];
    if (cell == nil)
    {
        NSArray *nib = [[NSBundle mainBundle] loadNibNamed:@"EventsTableCell" owner:self options:nil];
        
        cell = (EventsTableCell*)[nib objectAtIndex:0];
    }
    
    //Set Name and Description
    NSDictionary *event = [_displayEvents objectAtIndex:indexPath.row];
    cell.event_title.text = [event objectForKey:@"name"];
                             
    NSString *startDateStr = [event objectForKey:@"start_time"];
    NSString *endDateStr = [event objectForKey:@"end_time"];
    
    NSDateFormatter *df = [[NSDateFormatter alloc] init];
    [df setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"UTC"]];
    [df setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    NSDate *st_date = [df dateFromString:startDateStr];
    NSDate *ed_date = [df dateFromString:endDateStr];
    
    [df setTimeZone:[NSTimeZone systemTimeZone]];
    
    [df setDateFormat:@"d"];
    cell.event_day.text=[df stringFromDate:st_date];
    
    [df setDateFormat:@"MMM"];
    cell.event_month.text=[df stringFromDate:st_date];
    
    [df setDateFormat:@"hh:mm a"];
    cell.event_time.text=[NSString stringWithFormat:@"%@ - %@", [df stringFromDate:st_date], [df stringFromDate:ed_date]];
    UIColor *grColor=[grmm getColorForGroupWithId:[event objectForKey:@"group_id"]AtAlpha:1];
    cell.group_color_bar.backgroundColor=grColor;
    
    UIView *bgColorView = [[UIView alloc] init];
    bgColorView.backgroundColor = grColor;
    [cell setSelectedBackgroundView:bgColorView];
    
    //Set the correct photo
    /*if([[[grmm.updates objectAtIndex:indexPath.row] objectForKey:@"link_type"] isEqual: @"event"]){
     cell.thumbnailImageView.image = [UIImage imageNamed:@"cal.png"];
     
     }
     else if([[[grmm.updates objectAtIndex:indexPath.row] objectForKey:@"link_type"] isEqual: @"task"]){
     cell.thumbnailImageView.image = [UIImage imageNamed:@"task.png"];
     }
     else {
     cell.thumbnailImageView.image = [UIImage imageNamed:@"default.png"];
     }*/
    
    
    return cell;
}

- (void) tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    
}


@end
